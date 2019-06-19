import { window, OverviewRulerLane, Range, Position } from 'vscode'
import ProvisionBase from '../common/ProvisionBase'
import Annotations from '../common/annotations/Annotations'

export default class Highlighter extends ProvisionBase {
  private colors : Object

  constructor() {
    super()
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
      Annotations.getInstance().get(k).then((files) => {
        files.forEach(e => {
          let ra = e.range
          if(kw[k].useColons) {
            ra = new Range(e.range.start, new Position(e.range.end.line, e.range.end.character + 1))
            if(!window.activeTextEditor.document.getText(ra).trim().endsWith(':')) return
          }
          r.push({
            range: ra
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