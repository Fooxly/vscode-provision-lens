import { window, StatusBarAlignment, Command } from 'vscode'
import ProvisionBase from '../common/ProvisionBase'

export default class Statusbarprovider extends ProvisionBase {
  private static instance : Statusbarprovider
  private items = {}

  public static getInstance() {
    if (!Statusbarprovider.instance) {
      Statusbarprovider.instance = new Statusbarprovider()
    }
    return Statusbarprovider.instance
  }

  public async create(group) {
    let key =  group.keywords.join('').toUpperCase()
    if(!!this.items[key]) return

    let s = window.createStatusBarItem(StatusBarAlignment.Left, 1)
    s.command = 'provisionlens.list.' + key
    this.items[key] = s
    s.show()
  }

  public async change(group, text) {
    let key = group.keywords.join('').toUpperCase()
    if(!this.items[key]) await this.create(group)
    this.items[key].text = text
  }

  public deactivate() {
    Object.keys(this.items).forEach(e => {
      this.items[e].dispose()
    })
  }
}