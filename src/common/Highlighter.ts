import { window, OverviewRulerLane, workspace, Range, Position } from 'vscode'
import Annotations from './Annotations'
import TodoBase from './TodoBase'

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
    this.colors = {}
    this.settings.get('highlights', []).forEach(h => {
      this.colors[h.keyword] = {
        decoration: window.createTextEditorDecorationType({
          backgroundColor: h.backgroundColor,
          isWholeLine: h.isWholeLine,
          color: h.color,
          overviewRulerLane: OverviewRulerLane.Right,
          overviewRulerColor: h.overviewRulerColor
        })
      }
    })
  }

  public update() {
    this.settings.get('highlights', []).forEach(h => {
      let r = []
      this.annotations.get(h.keyword).forEach(e => {
        r.push({
          range: (h.colorSpaceAfter ? new Range(e.range.start, new Position(e.range.end.line, e.range.end.character + 1)) : e.range)
        })
      })
      window.activeTextEditor.setDecorations(this.colors[h.keyword].decoration, r)
    })

  }

  public configChanged() {
    this.settings = workspace.getConfiguration('todolens')
    this.setupColors()
  }
}