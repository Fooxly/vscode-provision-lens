import { WorkspaceConfiguration, workspace, Disposable } from 'vscode'
import DocumentItems, { DocumentItem } from './Documentitems'

export default abstract class ProvisionBase {
  protected settings: WorkspaceConfiguration
  protected disposables: Disposable[] | null = null
  
  constructor() {
    // load the settings
    this.settings = workspace.getConfiguration('provisionlens')
  }

  public initialize(): Disposable[] | null { return null }
  public deactivate() {
    if(!!this.disposables) {
      this.disposables.forEach(d => {
        d.dispose()
      })
    }
  }
  protected configChanged() {}
  public update(item: DocumentItem | undefined) { }
  public lateUpdate(items: DocumentItems | undefined) { }
  public onConfigChanged() {
    // change config local
    this.settings = workspace.getConfiguration('provisionlens')
    this.configChanged()
  }
}