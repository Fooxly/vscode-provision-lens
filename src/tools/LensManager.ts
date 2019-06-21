import { CodeLensProvider, TextDocument, CodeLens, languages, Disposable } from 'vscode'
import ProvisionBase from '../common/ProvisionBase'
import DocumentItems, { DocumentItem } from '../common/Documentitems'
import GroupItem, { GroupTextObject } from '../common/options/GroupItem'
import Translations from '../translations/Translations'
import StatusbarManager from './StatusbarManager';

export default class LensManager extends ProvisionBase implements CodeLensProvider {
  private instances: CodeLens[] = []
  private statusbar: StatusbarManager | undefined
  private groupKeys: Map<string, number> = new Map<string, number>()
  private lensAtZero: boolean = false

  public initialize(): Disposable[] | null {
    if(!this.disposables) this.disposables = []
    this.statusbar = new StatusbarManager()
    this.disposables.push(languages.registerCodeLensProvider({
        language: "*",
        scheme: "file"
      },
      this
    ))

    let i = 0
    this.settings.get('groups', []).forEach((g: GroupItem) => {
      this.groupKeys.set(g.keywords.join('').toUpperCase(), i++)
    })
    return this.disposables
  }

  public update(item: DocumentItem | undefined) {
    
  }

  public lateUpdate(data: DocumentItems | undefined) {
    this.instances = []
    let overviewType = this.settings.get('fileOverview', 'auto').toString()
    this.lensAtZero = false
    if(!data || overviewType === 'off') {
      this.instances = []
      return
    }

    for(let i of data.items) {
      this.createItemLens(this.GetLensDetails(i))
    }

    if(data.root) {
      let details = this.GetLensDetails(data.root, true)
      let overviewType = this.settings.get('fileOverview', 'auto').toString()
      switch(overviewType) {
        case 'auto': {
          if(!this.lensAtZero) {
            if(!!this.statusbar) this.statusbar.update([])
            this.createItemLens(details)
          } else {
            if(!!this.statusbar) this.statusbar.update(details)
          }
          break 
        }
        case 'both': {
          if(!!this.statusbar) this.statusbar.update(details)
          if(!this.lensAtZero) this.createItemLens(details)
          break 
        }
        case 'always-both': {
          if(!!this.statusbar) this.statusbar.update(details)
          this.createItemLens(details)
          break 
        }
        case 'top': {
          if(!!this.statusbar) this.statusbar.update([])
          if(!this.lensAtZero) this.createItemLens(details)
          break
        }
        case 'always-top': {
          if(!!this.statusbar) this.statusbar.update([])
          this.createItemLens(details)
          break
        }
        case 'statusbar': {
          if(!!this.statusbar) this.statusbar.update(details)
          break
        }
      }
    }
  }

  private GetLensDetails(item: DocumentItem, isRoot: boolean = false): any[] {
    let details: any[] = []
    let groups: GroupItem[] = this.settings.get('groups', [])
    for(let g in item.items) {
      if(item.container_start.start.line === 0 && !isRoot) this.lensAtZero = true
      if(!this.groupKeys.has(g)) continue
      let id = this.groupKeys.get(g)
      if(id === undefined) continue
      details.push({
        group_id: id,
        group_name: g,
        container_start: item.container_start,
        tooltip: groups[id].tooltip,
        title: Translations.createOverviewTitle(groups[id].text, item.items[g].size),
        command: (item.items[g].size ? 'provisionlens.listsection' : ''),
        arguments: [{items: item.items[g].items}]
      })
    }
    return details
  }

  private createItemLens(details: any[]) {
    for(let d of details) {
      this.instances.push(new CodeLens(d.container_start, {
        title: d.title,
        command: d.command,
        arguments: d.arguments
      }))
    }
  }

  protected configChanged() {
    if(!this.settings.get('enableLenses', true)) {
      this.deactivate()
      return
    }
  }

  async provideCodeLenses(document: TextDocument): Promise<CodeLens[] | null> {
    return this.instances
  }

  public deactivate() {
    super.deactivate()
    this.instances = []
    if(!!this.statusbar) this.statusbar.deactivate()
  }
}