import {TextDocument, SymbolInformation, commands, SymbolKind} from 'vscode'
export default class DocumentReader {
  public async getFunctions(document: TextDocument) : Promise<SymbolInformation[]> {
    let r : SymbolInformation[] = []
    await this.getSymbols(document).then((v) => {
      for(let e of v) {
        r.push(...this.getFunctionsInChildren(e))
      }
    })
    return r
  }

  private getFunctionsInChildren(information: SymbolInformation) {
    let r = []
    if(information.kind == SymbolKind.Function) {
      r.push(information)
      information.children.forEach(e => {
        r.push(...this.getFunctionsInChildren(e))
      })
    }
    return r
  }

  private getSymbols(document: TextDocument): Thenable<SymbolInformation[]> {
    return commands.executeCommand<SymbolInformation[]>(
      'vscode.executeDocumentSymbolProvider',
      document.uri
    )
  }
}