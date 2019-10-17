import { window, Selection, TextEditorRevealType, commands, TextDocument, DocumentSymbol, SymbolKind, TextEditor } from 'vscode'

export default class DocumentUtils {
  /**
   * Move the user to a specific line in the code
   * @param line The number of the line within the document starting with 0
   * @param editor The TextEditor to use (if null, the window.activeTextEditor is used)
   */
  public static moveToLine (line: number, editor?: TextEditor): void {
    let e: TextEditor | undefined
    if (editor) {
      e = editor
    } else if (window.activeTextEditor) {
      e = window.activeTextEditor
    }

    if (e) {
      const range = e.document.lineAt(line).range
      e.selection = new Selection(range.start, range.start)
      e.revealRange(range, TextEditorRevealType.InCenter)
    }
  }

  /**
   * Get all the DocumentSymbols from a document
   * @param document The document to use
   */
  public static getSymbols (document: TextDocument): Thenable<DocumentSymbol[] | undefined> {
    return commands.executeCommand<DocumentSymbol[]>(
      'vscode.executeDocumentSymbolProvider',
      document.uri
    )
  }

  public static getChildMembers (symbol: DocumentSymbol): DocumentSymbol[] {
    let r: DocumentSymbol [] = []
    if (this.isFunction(symbol) || this.isClass(symbol)) {
      r.push(symbol)
    } else if (this.isVariable(symbol)) {
      if (symbol.children.length === 0) return r
      else r.push(symbol)
    }

    for (const e of symbol.children) {
      r.push(...this.getChildMembers(e))
    }

    return r
  }

  /**
   * Check if the DocumentSymbol is a variable
   * @param i The DocumentSymbol which needs to be checked
   */
  public static isVariable (i: DocumentSymbol): boolean {
    return i.kind === SymbolKind.Variable
  }

  /**
   * Check if the DocumentSymbol is a function
   * @param i The DocumentSymbol which needs to be checked
   */
  public static isFunction (i: DocumentSymbol): boolean {
    return i.kind === SymbolKind.Function || i.kind === SymbolKind.Method || i.kind === SymbolKind.Constructor || i.name === 'constructor'
  }

  /**
   * Check if the DocumentSymbol is a class/struct
   * @param i The DocumentSymbol which needs to be checked
   */
  public static isClass (i: DocumentSymbol): boolean {
    return i.kind === SymbolKind.Class || i.kind === SymbolKind.Interface || i.kind === SymbolKind.Struct
  }
}
