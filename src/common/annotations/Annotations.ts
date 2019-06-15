import { workspace, window, Range, Position, TextDocument } from 'vscode'
import * as fs from 'fs'
import TodoBase from '../TodoBase'
import Annotation from './Annotation'
import { dirname } from 'path'

export default class Annotations extends TodoBase {
  private _ann = {}
  private ignored = []

  constructor() {
    super()
    this._ann = {}
    this.ignored = this.settings.get('excluded')
  }

  public update() {
    // content changed for the file
    let activeEditor = window.activeTextEditor
    if (!activeEditor) {
      return []
    }
    this._ann = {}
    let s = this.settings.get('keywords', {})
    // get all the notes from the current file
    Object.keys(s).forEach(k => {
      this._ann[k.toUpperCase()] = this.find(k)
    })
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
    if(doc.fileName.endsWith('.ignore') || doc.fileName.endsWith('.gitignore')) {
      return true
    }
    return false
  }

  /**
   * Update the excluded property based on the gitignore and ignore files in the current workspace
   */
  public async updateIgnore() {
    this.ignored = []

    var ignores = await workspace.findFiles('**/.gitignore')
    ignores.push(...(await workspace.findFiles('**/.ignore')))
    if (!ignores.length) return
    
    const ip = ignores.map((f) => {
      return workspace.openTextDocument(f.path)
    })
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
          this.ignored.push(p)
        }
      }
    })
    this.settings.update('excluded', this.ignored, false)
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
   * @param key: the keyword which needs to be found
   * @param fText: a string of text where we need to search in 
   */
  public async getAsync(key : string, fText : string = null) : Promise<Array<Annotation>> {
    let r : Array<Annotation> = []
    await this.get(key,fText).then(f => {
      r = f
    }).catch(() => {
      r = null
    })
    return r
  }

  /**
   * Find all the annotations inside of the provided text (otherwise the whole document)
   * @param key: the keyword which needs to be found
   * @param fText: a string of text where we need to search in 
   */
  public get(key : string, fText : string = null) : Promise<Array<Annotation>> {
    return new Promise((resolve, reject) => {
      if(this.isExcluded()) return reject(null)
      let k = key.toUpperCase()
      // if there is no text specified, search the whole file
      if(!fText) {
        if(!this._ann[k]) this._ann[k] = this.find(k)
        return resolve(this._ann[k])
      }
      // find keys inside the given text
      return resolve(this.find(k, fText))
    })
  }

  /**
   * Find the actual keyword 
   * @param key: the keyword which needs to be found
   * @param fText: a string of text where we need to search in 
   */
  private find(key, fText = null) : Array<Annotation> {
    let activeEditor = window.activeTextEditor
    let text = (!fText ? activeEditor.document.getText() : fText)
    let t = []
    let match, regex
    let kw = this.settings.get('keywords', {})[key.toUpperCase()]
    let cs = (!kw ? true : kw.caseSensitive)
    // if case sensetive
    if(cs) {    
      regex = new RegExp(`\\b(${key})\\b`, 'gm')
    } else {
      regex = new RegExp(`\\b(${key})\\b`, 'igm')
    }
    while(match = regex.exec(text)) {
      let pos = activeEditor.document.positionAt(match.index)
      t.push({
        text: activeEditor.document.lineAt(pos).text,
        index: pos.line + 1,
        range: new Range(pos, activeEditor.document.positionAt(match.index + match[0].length))
      })
    }
    return t
  }
}