import { CodeLensProvider, CodeLens, TextDocument, Range, Position, Command, window } from 'vscode'
import Hub from './Hub'
import Utils from '../core/Utils'

export default class Lens implements CodeLensProvider {
  private main: Hub
  private fileLenses: CodeLens[] = []
  private lenses: CodeLens[] = []
  private areFileLensesUpdated: boolean = false
  private displayMethod: string = 'default'

  constructor(main: Hub) {
    this.main = main
  }

  public update(data?: any) {
    this.fileLenses = []
    this.areFileLensesUpdated = false
    if(data && this.displayMethod === 'default' || this.displayMethod === 'file') {
      Object.keys(data).forEach(e => {
        let props = Utils.getGroupProps(this.main, e)
        let containers: any = { }
        for(let i of data[e].items) {
          if(!containers[i.container.start.line]) {
            containers[i.container.start.line] = {
              amount: 1,
              container: i.container,
              items: [i]
            }
          } else {
            containers[i.container.start.line].amount++
            containers[i.container.start.line].items.push(i)
          }
        }
        
        Object.keys(containers).forEach(c => {
          let amount = containers[c].amount
          let title = ''
          if(props.title[amount]) title = props.title[amount]
          else title = props.title['*']
          if(!title || title === '') {
            window.showErrorMessage('Invalid title property for the "' + e + '" keyword')
            title = '{0}'
          }
          title = title.replace('{0}', amount)
          this.fileLenses.push(new CodeLens(containers[c].container, {
            title: title,
            command: this.main.getUUID() + 'provision.popup',
            arguments: [{
              items: containers[c].items
            }]
          }))
        })
      })
    }
  }

  public detailedUpdate(data?: any) {
    this.lenses = []
    if(data && this.displayMethod === 'default' || this.displayMethod === 'detailed') {
      Object.keys(data).forEach(e => {
        let props = Utils.getGroupProps(this.main, e)
        let containers: any = { }
        for(let i of data[e].items) {
          if(!containers[i.container.start.line]) {
            containers[i.container.start.line] = {
              amount: 1,
              container: i.container,
              items: [i]
            }
          } else {
            containers[i.container.start.line].amount++
            containers[i.container.start.line].items.push(i)
          }
        }
        
        Object.keys(containers).forEach(c => {
          let amount = containers[c].amount
          let title = ''
          if(props.title[amount]) title = props.title[amount]
          else title = props.title['*']
          if(!title || title === '') {
            window.showErrorMessage('Invalid title property for the "' + e + '" keyword')
            title = '{0}'
          }
          title = title.replace('{0}', amount)
          this.register(containers[c].container, {
            title: title,
            command: this.main.getUUID() + 'provision.popup',
            arguments: [{
              items: containers[c].items
            }]
          })
        })
      })
    }
  }

  public configChanged() {
    this.displayMethod = this.main.config.get('lens.displayMethod', 'default')
  }

  public dispose() {
    this.lenses = []
    this.fileLenses = []
  }

  async provideCodeLenses(doc: TextDocument): Promise<CodeLens[] | null> {
    return [...this.lenses, ...this.fileLenses]
  }

  private register(range: Range, command: Command) {
    if(range.start.line === 0 && this.fileLenses && !this.areFileLensesUpdated) {
      this.areFileLensesUpdated = true
      this.fileLenses.forEach(l => {
        let c: Command | undefined = l.command
        if(c) {
          l.command = {
            title: 'Total: ' + c.title,
            arguments: c.arguments,
            command: c.command
          }
        }
      })
    }
    this.lenses.push(new CodeLens(range, command))
  }
}