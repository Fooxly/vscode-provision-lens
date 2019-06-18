import { window, OverviewRulerLane, Range, Position } from 'vscode'
import Annotations from '../common/annotations/Annotations'
import ProvisionBase from '../common/ProvisionBase'

export default class Highlighter extends ProvisionBase {
  private colors : Object
  private annotations : Annotations

  constructor(annotations : Annotations) {
    super()
    this.annotations = annotations
    this.colors = {}
    this.setupColors()
  }

  public setupColors() {
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
      this.annotations.get(k).then((files) => {
        files.forEach(e => {
          r.push({
            range: (kw[k].colorSpaceAfter ? new Range(e.range.start, new Position(e.range.end.line, e.range.end.character + 1)) : e.range)
          })
        })
        window.activeTextEditor.setDecorations(this.colors[k].decoration, r)
      }).catch(() => { })
    })

  }

  public configChanged() {
    super.configChanged()
    this.setupColors()
  }
}