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
    if(!this.settings.get('highlighting', true)) return
    if(!window.activeTextEditor) return
    if(!data) return
    let keywords: any = this.settings.get('keywords', {})
    
    let items: any = {}
    if(data) {
      for(let n in data.items) {
        for(let i of data.items[n].items) {
          if(keywords[i.keyword]) {
            if(keywords[i.keyword].highlight === 'off') continue
          }
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
      let pl: number | undefined = this.getRulerPlacement(keywords[k].rulerPlacement)
      if(!pl) continue
      this.colors[k] = window.createTextEditorDecorationType({
        backgroundColor: keywords[k].backgroundColor,
        isWholeLine: keywords[k].highlight === 'line',
        color: keywords[k].color,
        overviewRulerLane: pl,
        overviewRulerColor: keywords[k].rulerColor
      })
    }
  }

  private getRulerPlacement(rulerPlacement: string): number | undefined {
    switch(rulerPlacement) {
      case 'left': {
        return OverviewRulerLane.Left
      }
      case 'right': {
        return OverviewRulerLane.Right
      }
      case 'center': {
        return OverviewRulerLane.Center
      }
      case 'full': {
        return OverviewRulerLane.Full
      }
    }
    return
  }

  protected configChanged() {
    this.updateColors()
  }
}