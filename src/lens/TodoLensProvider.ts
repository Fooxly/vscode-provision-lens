import { workspace, CodeLensProvider, Range, Command, CodeLens, TextDocument, CancellationToken, window, OverviewRulerLane, Position } from 'vscode'
import Annotations from '../common/annotations/Annotations'
import TodoBase from '../common/TodoBase'
export default class TodoLensProvider extends TodoBase implements CodeLensProvider {
  private annotations : Annotations

  constructor(annotations : Annotations) {
    super()
    this.annotations = annotations
  }

  async provideCodeLenses(doc : TextDocument) : Promise<CodeLens[]> {
    this.settings = workspace.getConfiguration('todolens')
    
    let lenses = []
    lenses.push(...(await this.createLenses(null)))
    return lenses
  }

  /**
   * Create all the lenses based on the given position
   * @param position: The position (line) where the lenses needs to be
   */
  async createLenses(position : Position) : Promise<Array<CodeLens>> {
    // if a custom position is given place it there, otherwise at the top of the file
    let r = (!position ? new Range(0,0,0,0) : new Range(position, position))
    let lenses = []
    // loop trough all the groups
    for(let g of this.settings.get('groups', [])) {
      let c = 0
      // check how many times the keyword is found
      for(let k of g.keywords) {
        let f = (await this.annotations.getAsync(k))
        if(!f) return []
        c += (await this.annotations.getAsync(k)).length
      }
      // create the actual string for the group
      let s = this.createString(g.text,c)
      if(s != null) {
        // add the lens for this group
        lenses.push(new CodeLens(r, {
          command: "todolens.list",
          arguments: [g.keywords.join('|')],
          title: s
        }))
      }
    }
    return lenses
  }

  /**
   * Create the actual string for the lens
   * @param t: a object or string with the text
   * @param c: the amount of notes
   */
  createString(t, c) : string {
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