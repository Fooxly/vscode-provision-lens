import { workspace, window, Range, Position } from 'vscode';
import TodoBase from '../TodoBase';
import Annotation from './Annotation';

export default class Annotations extends TodoBase {
  private _ann = {}

  constructor() {
    super()
    this._ann = {}
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


  public getPreviousNoteLocation() {
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
  public getNextNoteLocation() {
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

  public getKeywords() {
    return Object.keys(this.settings.get('keywords', {}))
  }

  public async getAsync(key, fText = null) {
    let r : Array<Annotation> = []
    await this.get(key,fText).then(f => {
      r = f
    })
    return r 
  }

  public get(key, fText = null) : Promise<Array<Annotation>> {
    return new Promise((resolve, reject) => {
      let k = key.toUpperCase()
      if(!fText) {
        if(!this._ann[k]) this._ann[k] = this.find(k)
        return resolve(this._ann[k])
      }
      return resolve(this.find(k, fText))
    })

    // find keys inside the given text

  }

  public remove(path) {
    delete this._ann[path]
  }

  private find(key, fText = null) : Array<Annotation> {
    let activeEditor = window.activeTextEditor
    
    let text = (!fText ? activeEditor.document.getText() : fText)
    let t = []
    let match, regex
    // if case sensetive

    let kw = this.settings.get('keywords', {})[key.toUpperCase()]
    let cs = (!kw ? true : kw.caseSensitive)
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