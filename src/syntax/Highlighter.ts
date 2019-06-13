import { window, OverviewRulerLane, workspace, Range, Position } from 'vscode'
import Annotations from '../common/Annotations'
import TodoBase from '../common/TodoBase'

export default class Highlighter extends TodoBase {
  private settings
  private colors
  private annotations : Annotations

  constructor(ann) {
    super()
    this.annotations = ann
    this.colors = {}

    this.settings = workspace.getConfiguration('todolens')
    this.setupColors()
  }

  public setupColors() {
    // TODO: if there are old highlights we need to remove them for the user so they don't have to restart
    if(!this.settings.get('useHighlighting', true)) return
    
    this.colors = {}
    let kw = this.settings.get('keywords', {})
    Object.keys(kw).forEach(k => {
      this.colors[k] = {
        decoration: window.createTextEditorDecorationType({
          backgroundColor: kw[k].backgroundColor,
          isWholeLine: kw[k].isWholeLine,
          color: kw[k].color,
          overviewRulerLane: OverviewRulerLane.Right,
          overviewRulerColor: kw[k].overviewRulerColor
        })
      }
    })
  }

  public update() {
    if(!this.settings.get('useHighlighting', true)) return
    let kw = this.settings.get('keywords', {})
    Object.keys(kw).forEach(k => {
      let r = []
      this.annotations.get(k, kw[k].caseSensitive).forEach(e => {
        r.push({
          range: (kw[k].colorSpaceAfter ? new Range(e.range.start, new Position(e.range.end.line, e.range.end.character + 1)) : e.range)
        })
      })
      window.activeTextEditor.setDecorations(this.colors[k].decoration, r)
    })

  }

  public configChanged() {
    this.settings = workspace.getConfiguration('todolens')
    this.setupColors()
  }
}