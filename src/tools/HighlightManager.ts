import { Disposable, window, OverviewRulerLane } from 'vscode'
import ProvisionBase from '../common/ProvisionBase'
import DocumentItems, { DocumentItem } from '../common/Documentitems'

export default class HighlightManager extends ProvisionBase {
  private colors: any = {}
  
  public initialize(): Disposable[] | null {
    this.updateColors()
    return this.disposables
  }

  public update(data: DocumentItem) {
    if(!this.settings.get('useHighlighting', true)) return
    if(!window.activeTextEditor) return
    if(!data) return
    
    let items: any = {}
    if(data) {
      for(let n in data.items) {
        for(let i of data.items[n].items) {
          if(!this.colors[i.keyword]) continue
          if(!items[i.keyword]) items[i.keyword] = []
          items[i.keyword].push(i.range)
        }
      }
    }
    for(let i in items) {
      window.activeTextEditor.setDecorations(this.colors[i], items[i])
    }
  }

  private updateColors() {
    let keywords: any = this.settings.get('keywords', {})
    this.colors = {}
    for(let k in keywords) {
      this.colors[k] = window.createTextEditorDecorationType({
        backgroundColor: keywords[k].backgroundColor,
        isWholeLine: keywords[k].isWholeLine,
        color: keywords[k].color,
        overviewRulerLane: OverviewRulerLane.Right,
        overviewRulerColor: keywords[k].overviewRulerColor
      })
    }
  }

  protected configChanged() {
    this.updateColors()
  }
}