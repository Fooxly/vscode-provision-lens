import { window, StatusBarAlignment } from 'vscode'

export default class StatusbarManager {
  private items: any = {}

  private create(details: any) {
    if(!!this.items[details.group_name]) return
    let s = window.createStatusBarItem(StatusBarAlignment.Left, 1)
    s.command = 'provisionlens.list.' + details.group_name
    s.tooltip = details.tooltip
    this.items[details.group_name] = s
    s.show()
  }

  public update(details: any[]) {
    if(!details.length && !Object.keys(this.items).length) return
    for(let i in this.items) {
      let stillAlive: boolean = false
      for(let d of details) {
        if(i === d.group_name) stillAlive = true
      }
      if(!stillAlive) this.remove(i)
    }

    for(let d of details) {
      if(!this.items[d.group_name]) this.create(d)
      this.items[d.group_name].text = d.title
    }
  }

  private remove(group: string) {
    this.items[group].hide()
    this.items[group].dispose()
    delete this.items[group]
  }

  public deactivate() {
    for(let i in this.items) {
      this.remove(i)
    }
  }
}