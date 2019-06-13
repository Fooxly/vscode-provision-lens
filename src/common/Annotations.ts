import { workspace, window, Range } from 'vscode';

export default class Annotations {
  private settings
  private _ann = {}

  constructor() {
    this.settings = workspace.getConfiguration('todolens')
    this._ann = {}
  }

  public update() {
    // content changed for the file
    let activeEditor = window.activeTextEditor
    if (!activeEditor) {
      return []
    }
    this._ann[activeEditor.document.uri.path] = {}
  }

  public get(key, caseSensitive) {
    this._ann = {}
    this._ann[key] = this.find(key, caseSensitive)
    return this._ann[key]
  }

  public remove(path) {
    delete this._ann[path]
  }

  private find(key, caseSensitive) : Object {
    let activeEditor = window.activeTextEditor
    let text = activeEditor.document.getText()
    let t = []
    let match, regex
    // if case sensetive
    if(caseSensitive) {    
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