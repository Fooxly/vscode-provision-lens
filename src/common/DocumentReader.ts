import {TextDocument, SymbolInformation, commands, SymbolKind} from 'vscode'
export default class DocumentReader {

  public async getClasses(document: TextDocument) : Promise<SymbolInformation[]> {
    let r : SymbolInformation[] = []
    await this.getSymbols(document).then((v) => {
      if(!v) return []
      for(let e of v) {
        r.push(...this.getClassesInChildren(e))
      }
    })
    return r
  }
  
  private getClassesInChildren(information) {
    let r = []
    if(this.IsClass(information)) {
      r.push(information)
      information.children.forEach(e => {
        r.push(...this.getClassesInChildren(e))
      })
    }
    return r
  }

  public async getFunctions(document: TextDocument) : Promise<SymbolInformation[]> {
    let r : SymbolInformation[] = []
    await this.getSymbols(document).then((v) => {
      if(!v) return []
      for(let e of v) {
        r.push(...this.getFunctionsInChildren(e))
      }
    })
    return r
  }

  private getFunctionsInChildren(information) {
    let r = []
    if(this.IsClass(information) || this.IsFunction(information)) {
      if(this.IsFunction(information)) r.push(information)
      information.children.forEach(e => {
        r.push(...this.getFunctionsInChildren(e))
      })
    }
    return r
  }

  private IsFunction(i) {
    return i.kind == SymbolKind.Function || i.kind == SymbolKind.Method
  }
  
  private IsClass(i) {
    return i.kind == SymbolKind.Class || i.kind == SymbolKind.Interface || i.kind == SymbolKind.Struct
  }

  private getSymbols(document: TextDocument): Thenable<SymbolInformation[]> {
    return commands.executeCommand<SymbolInformation[]>(
      'vscode.executeDocumentSymbolProvider',
      document.uri
    )
  }
}