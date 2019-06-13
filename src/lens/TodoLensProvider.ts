import { workspace, CodeLensProvider, Range, Command, CodeLens, TextDocument, CancellationToken, window, OverviewRulerLane } from 'vscode'
export default class TodoLensProvider implements CodeLensProvider {

  private settings
  private annotations = {

  }

  public Update(annotations) {
    this.annotations = annotations
  }

  async provideCodeLenses(doc : TextDocument) : Promise<CodeLens[]> {
    if (!window.activeTextEditor) {
      return
    }
    this.settings = workspace.getConfiguration('todolens')
    let r = new Range(0,0,0,0)
    let lenses = []

    this.settings.get('types', []).forEach(type => {
      let c = 0
      type.types.forEach(t => {
        c += this.annotations[t].length
      })

      let s = this.createString(type,c)
      if(s != null) {
        lenses.push(new CodeLens(r, {
          command: "todolens.list",
          arguments: [type.types.join('|')],
          title: this.createString(type, c)
        }))
      }
    })
    return lenses
  }


  createString(t, c) {
    let r = t.title
    if(this.settings.get('hideWhenZero', true) && !c) return null
    if(r == null) return r
    return r.replace('{0}', c)
  }
}