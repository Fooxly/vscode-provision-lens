import { window, TextEditor, workspace, DocumentSymbol, TextDocument, Range, Position } from 'vscode'

import Main from '../Main'
import Utils from '../Utils'
import DocumentUtils from './DocumentUtils'
import { DocumentListener } from './DocumentListener'

export default class Document {
  private main: Main
  private editor?: TextEditor
  
  private listeners: DocumentListener[] = []

  constructor (main: Main) {
    this.main = main
    this.initialize()
  }

  private initialize () {
    window.onDidChangeActiveTextEditor(e => {
      this.editor = e
      if (this.editor) {
        this.update()
        this.detailedUpdate()
      }
    }, null, this.main.context.subscriptions)
    
    workspace.onDidChangeTextDocument(e => {
      if (this.editor && e.document === this.editor.document) {
        this.update()
        this.detailedUpdate()
      }
    }, null, this.main.context.subscriptions)

    this.editor = window.activeTextEditor
    process.nextTick(() => {
      this.update()
      this.detailedUpdate()
    })
  }

  public addListener (listener: DocumentListener) {
    this.listeners.push(listener)
  }

  public update () {
    if (!this.editor || !this.editor.document) {
      for (const l of this.listeners) {
        l.update()
      }
      return
    }

    const i = this.getDataInRange(this.editor.document.validateRange(new Range(0,0,this.editor.document.lineCount, 0)), this.editor.document)
    for (const l of this.listeners) {
      l.update(i)
    }
  }

  public detailedUpdate () {
    if (!this.editor || !this.editor.document) {
      for (const l of this.listeners) {
        l.detailedUpdate()
      }
      return
    }

    DocumentUtils.getSymbols(this.editor.document).then(symbols => {
      if (!this.editor || !this.editor.document || !symbols) {
        for (const l of this.listeners) {
          l.detailedUpdate()
        }
        return
      }

      const r: DocumentSymbol[] = []
      for (const symbol of symbols) {
        r.push(...DocumentUtils.getChildMembers(symbol))
      }

      const result: any = { }
      for (const symbol of r) {
        const i = this.getDataInRange(symbol.range, this.editor.document)
        for (const e of Object.keys(i)) {
          if (!result[e]) result[e] = i[e]
          else {
            result[e].amount += i[e].amount
            result[e].items.push(...i[e].items)
          }
        }
      }
    
      for (const l of this.listeners) {
        l.detailedUpdate(result)
      }
    })
  }

  private getDataInRange (range: Range, document?: TextDocument): any {
    if (!this.editor) return
    const doc = document || this.editor.document
    if (!doc) return

    const text: string = doc.getText(range)
    if (text.length === 0) return
    const result: any = { }

    const keywords: any = this.main.config.get('keywords', {})
    for (const keyword of Object.keys(keywords)) {
      const groupId: any = Utils.getGroup(this.main, keyword)
      let match: RegExpExecArray | null, regex: RegExp = new RegExp(
        `\\b(${keywords[keyword].keyword}${keywords[keyword].includesColon ? ':' : ''})`,
        `${keywords[keyword].caseSensitive ? '' : 'i'}gm`
      )

      if (!result[groupId]) result[groupId] = {
        amount: 0,
        items: [],
        keywords: []
      }

      while (match = regex.exec(text)) {
        const pos: Position = doc.positionAt(match.index + doc.offsetAt(range.start))
        const r: Range = new Range(pos, doc.positionAt(match.index + doc.offsetAt(range.start) + match[0].length - (keywords[keyword].includesColon ? 1 : 0)))

        if (result[groupId].keywords.indexOf(keyword) === -1) result[groupId].keywords.push(keyword)

        result[groupId].amount++
        result[groupId].items.push({
          keyword: keyword,
          text: doc.lineAt(pos).text,
          range: r,
          container: range
        })
      }
    }
    return result
  }
}