import { window, TextEditor, workspace, DocumentSymbol, TextDocument, Range, Position } from 'vscode'
import Main from '../Main'
import DocumentUtils from './DocumentUtils'
import { DocumentListener } from './DocumentListener'
import Utils from '../Utils'

export default class Document {
  private main: Main
  private editor?: TextEditor
  
  private listeners: DocumentListener[] = []

  constructor(main: Main) {
    this.main = main
    this.initialize()
  }

  private initialize() {
    window.onDidChangeActiveTextEditor(async e => {
      this.editor = e
      if(this.editor) {
        this.update()
        this.detailedUpdate()
      }
    }, null, this.main.context.subscriptions)

    workspace.onDidChangeTextDocument(e => {
      if(this.editor && e.document === this.editor.document) {
        this.update()
        this.detailedUpdate()
      }
    }, null, this.main.context.subscriptions)

    this.editor = window.activeTextEditor
    setTimeout(() => {
      this.update()
      this.detailedUpdate()
    }, 100)
  }

  public addListener(listener: DocumentListener) {
    this.listeners.push(listener)
  }

  public update() {
    if(!this.editor || !this.editor.document) {
      return this.listeners.forEach(l => { l.update() })
    }
    let i = this.getDataInRange(this.editor.document.validateRange(new Range(0,0,this.editor.document.lineCount, 0)), this.editor.document)
    return this.listeners.forEach(l => { l.update(i) })
  }

  public detailedUpdate() {
    if(!this.editor || !this.editor.document) {
      return this.listeners.forEach(l => { l.detailedUpdate() })
    }

    DocumentUtils.getSymbols(this.editor.document).then(symbols => {
      if(!this.editor || !this.editor.document || !symbols) return this.listeners.forEach(l => { l.detailedUpdate() })
      let r: DocumentSymbol[] = []
      for(let symbol of symbols) {
        r.push(...DocumentUtils.getChildMembers(symbol))
      }
      let result: any = { }
      for(let symbol of r) {
        let i = this.getDataInRange(symbol.range, this.editor.document)
        Object.keys(i).forEach(e => {
          if(!result[e]) result[e] = i[e]
          else {
            result[e].amount += i[e].amount
            result[e].items.push(...i[e].items)
          }
        })
      }
      return this.listeners.forEach(l => { l.detailedUpdate(result) })
    })
  }

  private getDataInRange(range: Range, document?: TextDocument): any {
    if(!this.editor) return
    let doc = document || this.editor.document
    if(!doc) return

    let text: string = doc.getText(range)
    if(text.length === 0) return
    let result: any = { }

    let keywords: any = this.main.config.get('keywords', {})
    Object.keys(keywords).forEach(keyword => {
      let groupId: any = Utils.getGroup(this.main, keyword)
      let match: RegExpExecArray | null, regex: RegExp

      if(keywords[keyword].caseSensitive) {
        if(keywords[keyword].includesColon) {
          regex = new RegExp(`\\b(${keywords[keyword].keyword}:)`, 'gm')
        } else {
          regex = new RegExp(`\\b(${keywords[keyword].keyword})`, 'gm')
        }
      } else {
        if(keywords[keyword].includesColon) {
          regex = new RegExp(`\\b(${keywords[keyword].keyword}:)`, 'igm')
        } else {
          regex = new RegExp(`\\b(${keywords[keyword].keyword})`, 'igm')
        }
      }

      if(!result[groupId])
        result[groupId] = {
          amount: 0,
          items: [],
        }

      while(match = regex.exec(text)) {
        let pos: Position = doc.positionAt(match.index + doc.offsetAt(range.start))
        let r: Range = new Range(pos, doc.positionAt(match.index + doc.offsetAt(range.start) + match[0].length))
        result[groupId].amount++
        result[groupId].items.push({
          keyword: keyword,
          text: doc.lineAt(pos).text,
          range: r,
          container: range
        })
      }
    })
    return result
  }
}