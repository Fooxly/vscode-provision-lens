import { CodeLensProvider, CodeLens, Range, Command, window } from 'vscode'

import Hub from './Hub'
import Utils from '../core/Utils'

export default class Lens implements CodeLensProvider {
  private main: Hub
  private lenses: CodeLens[] = []
  private fileLenses: CodeLens[] = []
  private displayMethod: string = 'default'
  private areFileLensesUpdated: boolean = false

  constructor (main: Hub) {
    this.main = main
  }

  public update (data?: any) {
    this.fileLenses = []
    this.areFileLensesUpdated = false

    if (data && (this.displayMethod === 'default' || this.displayMethod === 'file')) {
      for (const e of Object.keys(data)) {
        const containers: any = {}
        for (const i of data[e].items) {
          if (!containers[i.container.start.line]) {
            containers[i.container.start.line] = {
              amount: 1,
              items: [i],
              container: i.container
            }
          } else {
            containers[i.container.start.line].amount++
            containers[i.container.start.line].items.push(i)
          }
        }

        const props = Utils.getGroupProps(this.main, e)
        for (const k of Object.keys(containers)) {
          const c = containers[k]
          const title = Utils.getTitle(e, props.title, c.amount)

          this.fileLenses.push(new CodeLens(c.container, {
            title,
            command: this.main.getUUID() + 'provision.popup',
            arguments: [{
              items: c.items
            }]
          }))
        }
      }
    }
  }

  public detailedUpdate (data?: any) {
    this.lenses = []

    if (data && (this.displayMethod === 'default' || this.displayMethod === 'detailed')) {
      for (const e of Object.keys(data)) {
        const containers: any = {}
        for (const i of data[e].items) {
          if (!containers[i.container.start.line]) {
            containers[i.container.start.line] = {
              amount: 1,
              items: [i],
              container: i.container
            }
          } else {
            containers[i.container.start.line].amount++
            containers[i.container.start.line].items.push(i)
          }
        }
        
        const props = Utils.getGroupProps(this.main, e)
        for (const k of Object.keys(containers)) {
          const c = containers[k]
          const title = Utils.getTitle(e, props.title, c.amount)

          this.register(c.container, {
            title,
            command: this.main.getUUID() + 'provision.popup',
            arguments: [{
              items: c.items
            }]
          })
        }
      }
    }
  }

  public configChanged () {
    this.displayMethod = this.main.config.get('lens.displayMethod', 'default')
  }

  public dispose () {
    this.lenses = []
    this.fileLenses = []
  }

  async provideCodeLenses (): Promise<CodeLens[] | null> {
    return this.lenses.concat(this.fileLenses)
  }

  private register (range: Range, command: Command) {
    if (range.start.line === 0 && this.fileLenses && !this.areFileLensesUpdated) {
      this.areFileLensesUpdated = true
      this.fileLenses.forEach((l, i) => {
        let c: Command | undefined = l.command
        if (c) {
          this.fileLenses[i].command = {
            command: c.command,
            arguments: c.arguments,
            title: `Total: ${c.title}`
          }
        }
      })
    }
    this.lenses.push(new CodeLens(range, command))
  }
}
