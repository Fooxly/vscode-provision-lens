import { ExtensionContext, Disposable, WorkspaceConfiguration, workspace, commands } from 'vscode'

export default abstract class Main {
  public context: ExtensionContext
  private cmds: Map<string, Disposable> = new Map<string, Disposable>()
  protected disposables: Disposable[] = []
  public config: WorkspaceConfiguration

  protected UUID: string

  constructor (context: ExtensionContext, UUID: string) {
    this.UUID = UUID
    this.context = context
    this.config = workspace.getConfiguration('provision')
    this._configChanged(false)

    workspace.onDidChangeConfiguration(() => {
      this._configChanged()
    })

    this.initialize()
  }

  private _configChanged (getconfig: boolean = true) {
    if (getconfig) this.config = workspace.getConfiguration('provision')
    this.configChanged()
  }

  public _dispose () {
    this.cmds.forEach(d => {
      d.dispose()
    })
    this.disposables.forEach(d => {
      d.dispose()
    })
    this.dispose()
  }

  public registerCommand (uri: string, callback: (...args: any[]) => any, useUUID: boolean = false) {
    const u = useUUID ? this.UUID + uri : uri
    if (this.cmds.get(u)) return

    const dis = commands.registerCommand(u, callback)
    this.context.subscriptions.push(dis)
    this.cmds.set(u, dis)
  }

  public getUUID (): string {
    return this.UUID
  }

  protected abstract initialize (): void
  protected abstract configChanged (): void
  protected abstract dispose (): void
}