import { workspace, CodeLensProvider, Range, Command, CodeLens, TextDocument, CancellationToken } from 'vscode'
export default class TodoLensProvider implements CodeLensProvider {

  settings

  async provideCodeLenses(doc : TextDocument) : Promise<CodeLens[]> {
    this.settings = workspace.getConfiguration('todolens')
    // console.log(doc)
    let r = new Range(0,0,0,0)
    let lenses = []
    
    this.settings.get('types', []).forEach(t => {
      let s = this.createString(doc, t)
      if(!s) return
      lenses.push(new CodeLens(r, {
        command: "",
        title: s
      }))
    })
    return lenses
  }

  createString(doc, type) {
    let r = type.title
    let c = this.searchAnnotations(doc, type)
    if(this.settings.get('hideWhenZero', true) && !c) return null
    return r.replace('{0}', c)
  }

  searchAnnotations(doc: TextDocument, type) : Number {
    let vals = type.types.join('|')
    let regex
    // if case sensetive
    if(this.settings.get('caseSensitive', false)) {    
      regex = new RegExp(`\\b(${vals})\\b`, 'gm')
    } else {
      regex = new RegExp(`\\b(${vals})\\b`, 'igm')
    }
    return (doc.getText().match(regex) || []).length;
  }
}