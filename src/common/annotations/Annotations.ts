import { workspace, window, Range, TextDocument } from 'vscode'
import * as _ from 'lodash'
import ProvisionBase from '../ProvisionBase'
import Annotation from './Annotation'
import { dirname } from 'path'

export default class Annotations extends ProvisionBase {

  private static instance : Annotations
  
  private _ann = {}
  private ignored = []

  constructor() {
    super()
    this._ann = {}
    this.updateIgnore()
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Annotations()
    }
    return this.instance
  }

  public configChanged() {
    super.configChanged()
    this.updateIgnore()
  }

  /**
   * Get the closest note based on the cursor position (above)
   */
  public getPreviousNoteLocation() : number {
    let c = window.activeTextEditor.selection.anchor.line + 1
    let closest
    Object.keys(this._ann).forEach(k => {
      this._ann[k].forEach(o => {
        if(!closest && o.index < c) {
          closest = o.index
        }
        if(o.index > closest && o.index < c) {
          closest = o.index
        }
      })
    })
    return closest
  }

  /**
   * Get the closest note based on the cursor position (below)
   */
  public getNextNoteLocation() : number {
    let c = window.activeTextEditor.selection.anchor.line + 1
    let closest
    Object.keys(this._ann).forEach(k => {
      this._ann[k].forEach(o => {
        if(!closest && o.index > c) {
          closest = o.index
        }
        if(o.index < closest && o.index > c) {
          closest = o.index
        }
      })
    })
    return closest
  }

  /**
   * Get an array of all the notes in the current document
   */
  public async getAllItemsInFile() {
		let an = this.getKeywords()
		let r = []
		an = _.uniqBy(an, (e) => {return e})
		// get all the values by the given types
		for(let a of an) {
			let files = (await this.getAsync(a))
			for(let t of files) {
				r.push({
          label: t.index + '',
          detail: t.text.trim(),
          description: a.toUpperCase()
				})
			}
		}
		return r
	}

  /**
   * Get an array of all the keywords in this extension
   */
  public getKeywords() : Array<string> {
    return Object.keys(this.settings.get('keywords', {}))
  }

  /**
   * Check if the document that is given is a ignore file we process 
   * @param doc: The document which needs to be checked
   */
  public checkIgnoreUpdate(doc : TextDocument) : boolean {
    for(let i of this.settings.get('ignoreFiles', [])) {
      if(doc.fileName.endsWith(i)) return true
    }
    return false
  }

  /**
   * Update the excluded property based on the gitignore and ignore files in the current workspace
   */
  public async updateIgnore() {
    this.ignored = []
    var ignores = []
    for(let i of this.settings.get('ignoreFiles', [])) {
      ignores.push(...(await workspace.findFiles('**/' + i)))
    }
    // var ignores = await workspace.findFiles('**/.gitignore')
    if (!ignores.length) return
    
    const ip = ignores.map((f) => {
      return workspace.openTextDocument(f.path)
    })
    const includes = this.settings.get('include', [])
    const docs = await Promise.all(ip)
    docs.forEach((doc) => {
      const relativePath = workspace.asRelativePath(doc.fileName)
      const dir = dirname(relativePath)
      for (let i = 0; i < doc.lineCount; i++) {
        let t = doc.lineAt(i).text
        if(t.length) {
          let p = t.trim()
          // check if it is not a comment in the ignore file
          if(t[0] == '#') continue 
          if (dir !== '.') {
            p = dir + '/' + t
          }
          if(!includes.includes(p)) this.ignored.push(p)
        }
      }
    })
  }

  /**
   * Returns true if the current open file is in the excluded files
   */
  private isExcluded() : boolean {
    let p : string = workspace.asRelativePath(window.activeTextEditor.document.uri.path)
    let r : boolean = false
    this.ignored.forEach(f => {
      if(f.includes('.')) {
        if(p.endsWith(f)) r = true
      } else {
        if(p.includes(f)) r = true
      }
    })
    return r
  }

  /**
   * Find all the annotations inside of the provided text (otherwise the whole document)
   * @param key: The keyword which needs to be found
   * @param range: The range of text where the words need to be found
   */
  public async getAsync(key : string, range : Range = null) : Promise<Array<Annotation>> {
    let r : Array<Annotation> = []
    await this.get(key,range).then(f => {
      r = f
    }).catch(() => {
      r = null
    })
    return r
  }

  /**
   * Find all the annotations inside of the provided text (otherwise the whole document)
   * @param key: The keyword which needs to be found
   * @param range: The range of text where the words need to be found
   */
  public get(key : string, range : Range = null) : Promise<Array<Annotation>> {
    return new Promise((resolve, reject) => {
      if(this.isExcluded()) return reject(null)
      let k = key.toUpperCase()
      // find keys inside the given text
      return resolve(this.find(k, range))
    })
  }

  /**
   * Find the actual keyword 
   * @param key: The keyword which needs to be found
   * @param range: The range of text where the words need to be found
   */
  private find(key, range : Range = null) : Array<Annotation> {
    let activeEditor = window.activeTextEditor
    let text = (!range ? activeEditor.document.getText() : activeEditor.document.getText(range))
    let t = []
    let match, regex
    let kw = this.settings.get('keywords', {})[key.toUpperCase()]
    let cs = (!kw ? true : kw.caseSensitive)
    
    // if case sensetive
    if(cs) {
      if(kw.useColons) {
        regex = new RegExp(`\\b(${key}:)`, 'gm')
      } else {
        regex = new RegExp(`\\b(${key})`, 'gm')
      }
    } else {
      if(kw.useColons) {
        regex = new RegExp(`\\b(${key}:)`, 'igm')
      } else {
        regex = new RegExp(`\\b(${key})`, 'igm')
      }
    }
    while(match = regex.exec(text)) {
      let pos = activeEditor.document.positionAt(match.index)
      let r = new Range(pos, activeEditor.document.positionAt(match.index + match[0].length))
      if(range != null) {
        pos = activeEditor.document.positionAt(match.index + activeEditor.document.offsetAt(range.start))
        r = new Range(pos, activeEditor.document.positionAt(match.index + activeEditor.document.offsetAt(range.start) + match[0].length))
      }

      t.push({
        text: activeEditor.document.lineAt(pos).text,
        index: pos.line + 1,
        range: r
      })
    }
    if(!range) this._ann[key.toUpperCase()] = t
    return t
  }


  /**
   * Create the actual string for the lens
   * @param t: a object or string with the text
   * @param c: the amount of notes
   */
  public createGroupString(t, c) : string {
    let rt
    if(typeof t == 'object') {
      rt = t.multiple
      if(c == 1) {
        rt = t.one
      }
    } else {
      rt = t
    }
    if(this.settings.get('hideWhenZero', true) && !c) return null
    if(rt == null) return rt
    return rt.replace('{0}', c)
  }
}