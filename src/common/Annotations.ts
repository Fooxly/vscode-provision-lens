import { workspace, window, Range } from 'vscode';
import TodoBase from './TodoBase';

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

  public get(key) {
    let k = key.toUpperCase()
    if(!this._ann[k]) this._ann[k] = this.find(k)
    return this._ann[k]
  }

  public remove(path) {
    delete this._ann[path]
  }

  private find(key) : Object {
    let activeEditor = window.activeTextEditor
    let text = activeEditor.document.getText()
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