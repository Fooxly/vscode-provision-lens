import { window, ExtensionContext, TextEditor, workspace, Range, TextDocument, commands, SymbolKind, DocumentSymbol, WorkspaceConfiguration, Position, Selection, TextEditorRevealType } from 'vscode'
import DocumentItems, { DocumentItemGroupObject, DocumentItem } from './Documentitems'
import { dirname } from 'path'
import ErrorHandler from './ErrorHandler'
import Translations from '../translations/Translations'

export default class DocumentManager {
  private settings: WorkspaceConfiguration
  private context: ExtensionContext
  private activeEditor: TextEditor | undefined
  private ignoredPaths: string[] = []
  public static instance: DocumentManager

  public currentItems: DocumentItems = {
    root: null,
    items: []
  }

  constructor(context: ExtensionContext) {
    this.context = context
    this.settings = workspace.getConfiguration('provisionlens')
    this.activeEditor = window.activeTextEditor
    this.updateIgnores()
    DocumentManager.instance = this
  }

  public static getInstance(): DocumentManager {
    return this.instance
  }

  private async getMembers(): Promise<DocumentSymbol[] | undefined> {
    let r : DocumentSymbol[] = []
    if(!this.activeEditor) return
    await this.getSymbols(this.activeEditor.document).then(v => {
      if(!v) return []
      for(let e of v) {
        r.push(...this.getChildMembers(e))
      }
    })
    return r
  }

  private getChildMembers(info: DocumentSymbol): DocumentSymbol[] {
    let r: DocumentSymbol [] = []
    if(this.IsFunction(info) || this.IsClass(info)) {
      r.push(info)
    } else if(this.IsVariable(info)) {
      if(info.children.length === 0) return r
    }

    info.children.forEach(e => {
      r.push(...this.getChildMembers(e))
    })
    return r
  }

  private getDataInRange(range: Range, isRoot: boolean = false): DocumentItem | undefined {
    if(!this.activeEditor) return
    let items: any = { }
    let text: string = this.activeEditor.document.getText(range)
    let keywords: any = this.settings.get('keywords', {})
    for(let group of this.settings.get('groups', [])) {
      let g: any = group
      let item: DocumentItemGroupObject = {
        size: 0,
        items: [],
        keywords: []
      }
      
      for(let k of g.keywords) {
        let match: any
        let regex: RegExp
        if(keywords[k]) {
          if(keywords[k].caseSensitive) {
            if(keywords[k].useColons) {
              regex = new RegExp(`\\b(${k}:)`, 'gm')
            } else {
              regex = new RegExp(`\\b(${k})`, 'gm')
            }
          } else {
            if(keywords[k].useColons) {
              regex = new RegExp(`\\b(${k}:)`, 'igm')
            } else {
              regex = new RegExp(`\\b(${k})`, 'igm')
            }
          }
        } else {
          regex = new RegExp(`\\b(${k})`, 'gm')
          // message that the key is not found
          ErrorHandler.getInstance().error('no_key_found_' + k, Translations.getTranslation('key_not_found') + k)
        }
        while(match = regex.exec(text)) {
          item.size++
          let pos: Position = this.activeEditor.document.positionAt(match.index + this.activeEditor.document.offsetAt(range.start))
          let r: Range = new Range(pos, this.activeEditor.document.positionAt(match.index + this.activeEditor.document.offsetAt(range.start) + match[0].length))
          item.items.push({
            keyword: k,
            keyword_settings: keywords[k],
            text: this.activeEditor.document.lineAt(pos).text,
            range: r
          })
        }
      }
      if(item.size > 0 || this.settings.get('alwaysShow', false)) {
        items[g.keywords.join('').toUpperCase()] = item
      }
    }
    let r: DocumentItem = {
      container_start: range,
      items,
      isRoot
    }
    if(isRoot && this.currentItems) this.currentItems.root = r
    return r
  }

  private async getData(): Promise<DocumentItems | undefined> {
    if(!this.activeEditor) return
    if(this.isExcluded()) return
    let result: DocumentItems = {
      root: this.currentItems.root,
      items: []
    }

    let usedLines: number[] = []

    // TODO: check if this is not an excluded file
    // TODO: Get all the data from the file
    await this.getMembers().then(members => {
      if(!members) return
      if(!this.activeEditor) return
      let position = this.settings.get('position', 'both')
      for(let m of members) {
        let canAdd = false
        if(this.IsClass(m) && (position === 'above_classes' ||position === 'both')) {
          canAdd = true
        } else if((this.IsFunction(m) || this.IsVariable(m)) && (position === 'above_functions' ||position === 'both')) {
          canAdd = true
        }
        
        if(canAdd) {
          if(usedLines.includes(m.range.start.line)) continue

          let i = this.getDataInRange(m.range)
          if(!!i) {
            result.items.push(i)
            usedLines.push(m.range.start.line)
          }
        }
      }
    })

    // submit all the data to the other modules
    this.currentItems = result
    return result
  }

  private async updateIgnores() {
    this.ignoredPaths = []
    var ignores = []
    for(let i of this.settings.get('ignoreFiles', [])) {
      ignores.push(...(await workspace.findFiles('**/' + i)))
    }
    if (!ignores.length) return
    
    const ip = ignores.map((f) => {
      return workspace.openTextDocument(f.path)
    })

    const includes: string[] = this.settings.get('whitelist', [])
    const docs = await Promise.all(ip)
    docs.forEach((doc) => {
      const relativePath = workspace.asRelativePath(doc.fileName)
      const dir = dirname(relativePath)
      for (let i = 0; i < doc.lineCount; i++) {
        let t = doc.lineAt(i).text
        if(t.length) {
          let p: string = t.trim()
          // check if it is not a comment in the ignore file
          if(t[0] === '#') continue 
          if (dir !== '.') {
            p = dir + '/' + t
          }
          if(!includes.includes(p)) this.ignoredPaths.push(p)
        }
      }
    })
  }

  private isExcluded() : boolean {
    if(!this.activeEditor) return false
    let p : string = workspace.asRelativePath(this.activeEditor.document.uri.path)
    let r : boolean = false
    this.ignoredPaths.forEach(f => {
      if(f.includes('.')) {
        if(p.endsWith(f)) r = true
      } else {
        if(p.includes(f)) r = true
      }
    })
    return r
  }

  public getPreviousNoteLocation() : number | undefined {
    if(!this.activeEditor || !this.currentItems || !this.currentItems.root) return
    let c = this.activeEditor.selection.anchor.line
    let closest: number | undefined

    for(let n in this.currentItems.root.items) {
      for(let i of this.currentItems.root.items[n].items) {
        if(!closest && i.range.start.line < c) closest = i.range.start.line
        if(!!closest && (i.range.start.line > closest && i.range.start.line < c)) closest = i.range.start.line
      }
    }
    return closest
  }

  public getNextNoteLocation() : number | undefined {
    if(!this.activeEditor || !this.currentItems || !this.currentItems.root) return
    let c = this.activeEditor.selection.anchor.line
    let closest: number | undefined

    for(let n in this.currentItems.root.items) {
      for(let i of this.currentItems.root.items[n].items) {
        if(!closest && i.range.start.line > c) closest = i.range.start.line
        if(!!closest && (i.range.start.line < closest && i.range.start.line > c)) closest = i.range.start.line
      }
    }
    return closest
  }

  public async start(start: (data: DocumentItem | undefined) => void, lateStart: (data: DocumentItems | undefined) => void) {
    if(start && this.activeEditor) {
      start(this.getDataInRange(this.activeEditor.document.validateRange(new Range(0,0,this.activeEditor.document.lineCount, 0)), true))
    }
    
    if(!lateStart) return
    lateStart((await this.getData()))
  }

  public onLateUpdate(event: (data: DocumentItems | undefined) => void) {
    window.onDidChangeActiveTextEditor(async e => {
      this.activeEditor = e
      if(e && event) {
        event((await this.getData()))
      }
    }, null, this.context.subscriptions)

    workspace.onDidChangeTextDocument(async e => {
      if(this.activeEditor && e.document === this.activeEditor.document && event) {
        event((await this.getData()))
      }
    }, null, this.context.subscriptions)
  }

  public onUpdate(event: (data: DocumentItem | undefined) => void) {
    window.onDidChangeActiveTextEditor(async e => {
      this.activeEditor = e
      if(this.activeEditor && event) {
        event(this.getDataInRange(this.activeEditor.document.validateRange(new Range(0,0,this.activeEditor.document.lineCount, 0)), true))
      }
    }, null, this.context.subscriptions)

    workspace.onDidChangeTextDocument(e => {
      if(this.activeEditor && e.document === this.activeEditor.document && event) {
        if(this.activeEditor && event) {
          event(this.getDataInRange(this.activeEditor.document.validateRange(new Range(0,0,this.activeEditor.document.lineCount, 0)), true))
        }
      }
    }, null, this.context.subscriptions)

    workspace.onDidSaveTextDocument((doc) => {
      for(let i of this.settings.get('ignoreFiles', [])) {
        if(doc.fileName.endsWith(i)) this.updateIgnores()
      }
    })
  }

  public onConfigChanged(event: () => void) {
    workspace.onDidChangeConfiguration(() => {
      this.settings = workspace.getConfiguration('provisionlens')
      this.updateIgnores()
      if(event) event()
    }, null, this.context.subscriptions)
  }

  public moveToLine(line: number) {
    if(!this.activeEditor) return
    let range = this.activeEditor.document.lineAt(line).range
    this.activeEditor.selection = new Selection(range.start, range.start)
    this.activeEditor.revealRange(range, TextEditorRevealType.InCenter)
  }

  private IsVariable(i: DocumentSymbol) {
    return i.kind === SymbolKind.Variable
  }

  private IsFunction(i: DocumentSymbol) {
    return i.kind === SymbolKind.Function || i.kind === SymbolKind.Method
  }
  
  private IsClass(i: DocumentSymbol) {
    return i.kind === SymbolKind.Class || i.kind === SymbolKind.Interface || i.kind === SymbolKind.Struct
  }

  private getSymbols(document: TextDocument): Thenable<DocumentSymbol[] | undefined> {
    return commands.executeCommand<DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      document.uri
    )
  }
}