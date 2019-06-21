import { Disposable, ExtensionContext, commands, window, QuickPickItem } from 'vscode'
import * as _ from 'underscore'
import ProvisionBase from '../common/ProvisionBase'
import DocumentManager from '../common/DocumentManager'
import Translations from '../translations/Translations'
import GroupItem from '../common/options/GroupItem';

export default class Commands extends ProvisionBase {
  private commands : Map<string, Disposable> = new Map<string, Disposable>()
  private groupCommands: string[] = []
  private context: ExtensionContext

  constructor(context: ExtensionContext) {
    super()
    this.context = context
  }

  public register(uri: string, func: any): Disposable | undefined {
    if(this.commands.get(uri)) return
    let dis = commands.registerCommand(uri, func)
    this.context.subscriptions.push(dis)
    this.commands.set(uri, dis)
    return dis
  }

  public initialize(): Disposable[] | null {
    if(!this.disposables) this.disposables = []

    this.RecreateGroupCommands()
    this.register('provisionlens.lastNote', () => {
      let dm = DocumentManager.getInstance()
      if(!dm) return
      let l = dm.getPreviousNoteLocation()
      // return a info message if there are no notes found below the cursors position
      if(!l) return window.showInformationMessage(Translations.getTranslation('noNoteFound'))
      dm.moveToLine(l)
    })

    this.register('provisionlens.nextNote', () => {
      let dm = DocumentManager.getInstance()
      if(!dm) return
      let l = dm.getNextNoteLocation()
      // return a info message if there are no notes found below the cursors position
      if(!l) return window.showInformationMessage(Translations.getTranslation('noNoteFound'))
      dm.moveToLine(l)
    })

    this.register('provisionlens.listall', () => {
      let dm = DocumentManager.getInstance()
      if(!dm || !dm.currentItems || !dm.currentItems.root) return
      let arr: any = []
      for(let n in dm.currentItems.root.items) {
        arr.push(...dm.currentItems.root.items[n].items)
      } 
      commands.executeCommand('provisionlens.listsection', {
        items: arr
      })
    })

    this.register('provisionlens.listsection', (args: any) => {
      let arr: QuickPickItem[] = []
      let keywords: string[] = Object.keys(this.settings.get('keywords', {}))
      if(!args.items) return
      let dropdownType = this.settings.get('dropdownType', 'normal')
      for(let i of args.items) {
        switch(dropdownType) {
          case 'normal': {
            let s = i.text.slice(i.range.start.character, i.text.length)
            s = s.split('//')
            arr.push({
              label: (i.range.start.line + 1).toString(),
              detail: s.join('//').trim(),
              description: i.keyword
            })
            break
          }
          case 'compact': {
            let s = i.text.slice(i.range.start.character, i.text.length)
            s = s.split('//')
            arr.push({
              label: (i.range.start.line + 1).toString(),
              description: s.join('//').trim()
            })
            break
          }
          case 'smart': {
            let fs = i.text.slice(i.range.start.character, i.text.length)
            let se = fs.split(new RegExp(`\\b(${keywords.join('|')})`, 'i'))
            fs = se[1] + se[2]
            if(i.keyword_settings) {
              if(i.keyword_settings.caseSensitive) {
                fs = fs.replace(new RegExp(i.keyword, ''), '')
              } else {
                fs = fs.replace(new RegExp(i.keyword, 'i'), '')
              }
              if(i.keyword_settings.useColons) fs = fs.replace(':', '')
            }
            let s = fs.split('//')
            if(s[0].trim().length === 0) s[0] = i.text.split('//')[1]
            arr.push({
              label: (i.range.start.line + 1).toString(),
              detail: s.join('//').trim(),
              description: i.keyword
            })
            break
          }
          case 'smart_compact': {
            let fs = i.text.slice(i.range.start.character, i.text.length)
            let se = fs.split(new RegExp(`\\b(${keywords.join('|')})`, 'i'))
            fs = se[1] + se[2]
            if(i.keyword_settings) {
              if(i.keyword_settings.caseSensitive) {
                fs = fs.replace(new RegExp(i.keyword, ''), '')
              } else {
                fs = fs.replace(new RegExp(i.keyword, 'i'), '')
              }
              if(i.keyword_settings.useColons) fs = fs.replace(':', '')
            }
            let s = fs.split('//')
            if(s[0].trim().length === 0) s[0] = i.text.split('//')[1]
            arr.push({
              label: (i.range.start.line + 1).toString(),
              description: s.join('//').trim()
            })
            break
          }
        }
      }
      let o = this.settings.get('dropdownOrder', 'line_numbers_asc')
			switch(o) {
				case 'line_numbers_asc': {
          arr = _.sortBy(arr, (r: any) => { return Number(r.label)}, ['asc'])
					break
				}
				case 'line_numbers_desc': {
          arr = _.sortBy(arr, (r: any) => { return Number(r.label)}, ['desc'])
					break
				}
      }
      window.showQuickPick(arr, {canPickMany: false, placeHolder: Translations.getTranslation('dropdownText')})
      .then((v) => {
        if(!v) return
        let d = DocumentManager.getInstance()
        if(!d) return
        d.moveToLine(Number(v.label) - 1)
      })
    })
    return this.disposables
  }

  private RecreateGroupCommands() {
    for(let g of this.groupCommands) {
      let i = this.commands.get(g)
      if(!!i) i.dispose()
      this.commands.delete(g)
    }
    this.groupCommands = []

    let groups: GroupItem[]  = this.settings.get('groups', [])
    for(let g of groups) {
      let key = g.keywords.join('').toUpperCase()
      let dis = this.register('provisionlens.list.' + key, () => {
        let dm = DocumentManager.getInstance()
        if(!dm || !dm.currentItems || !dm.currentItems.root) return
        commands.executeCommand('provisionlens.listsection', {
          items: dm.currentItems.root.items[key].items
        })
      })
      if(!!dis) this.groupCommands.push('provisionlens.list.' + key)
    }
  }

  protected configChanged() {
    this.RecreateGroupCommands()
  }
}