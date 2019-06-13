import { workspace, CodeLensProvider, Range, Command, CodeLens, TextDocument, CancellationToken, window, OverviewRulerLane } from 'vscode'
import Annotations from '../common/Annotations'
import TodoBase from '../common/TodoBase'
export default class TodoLensProvider extends TodoBase implements CodeLensProvider {
  private settings
  private annotations : Annotations

  constructor(ann) {
    super()
    this.annotations = ann
  }

  public configChanged() {}

  async provideCodeLenses(doc : TextDocument) : Promise<CodeLens[]> {
    this.settings = workspace.getConfiguration('todolens')
    let r = new Range(0,0,0,0)
    let lenses = []
    
    this.settings.get('groups', []).forEach(g => {
      let c = 0
      g.keywords.forEach(k => {
        let kw = this.settings.get('keywords', {})[k]
        let cs = (!kw ? true : kw.caseSensitive)
        c += this.annotations.get(k.toUpperCase(), cs).length
        
      })
      let s = this.createString(g.text,c)
      if(s != null) {
        lenses.push(new CodeLens(r, {
          command: "todolens.list",
          arguments: [g.keywords.join('|')],
          title: s
        }))
      }
    })
    return lenses
  }


  createString(t, c) {
    let rt
    if(typeof t == 'object') {
      rt = t.multiple
      if(c == 1) {
        rt = t.one
      }
    } else {
      rt = t
    }
    if(this.settings.get('hideWhenZero', true) && !c) return null
    if(rt == null) return rt
    return rt.replace('{0}', c)
  }
}