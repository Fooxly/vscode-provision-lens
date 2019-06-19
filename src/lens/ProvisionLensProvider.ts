import { workspace, CodeLensProvider, Range, CodeLens, TextDocument } from 'vscode'
import Annotations from '../common/annotations/Annotations'
import ProvisionBase from '../common/ProvisionBase'
import DocumentReader from '../common/DocumentReader'
import Commands from '../common/Commands'
import Statusbarprovider from '../statusbar/StatusbarProvider'
import GroupItems from '../common/groups/GroupItems'

export default class ProvisionLensProvider extends ProvisionBase implements CodeLensProvider {
  private reader : DocumentReader = new DocumentReader()

  async provideCodeLenses(doc : TextDocument) : Promise<CodeLens[]> {
    this.settings = workspace.getConfiguration('provisionlens')
    
    let lenses = []
    let cls, fs

    for(let g of this.settings.get('groups', [])) {
      let l = await this.CreateLens(g, null, true)
      if(!!l) lenses.push(l)
    }

    if(this.settings.get('showLensAboveClasses', true)) {
      cls = await (this.reader.getClasses(doc))
      if(cls.length == 1) {
        for(let g of this.settings.get('groups', [])) {
          let l = await this.CreateLens(g, cls[0].location.range)
          if(!!l) lenses.push(l)
        }
      } else if(cls.length > 1) {
        for(let g of this.settings.get('groups', [])) {
          for(let c of cls) {
            let l = await this.CreateLens(g, c.location.range)
            if(!!l) lenses.push(l)
          }
        }
      }
    }

    if(this.settings.get('showLensAboveFunctions', true)) {
      fs = await (this.reader.getFunctions(doc))
      for(let g of this.settings.get('groups', [])) {
        for(let f of fs) {
          let l = await this.CreateLens(g, f.location.range)
          if(!!l) lenses.push(l)
        }

      }
    }
    
    return lenses
  }

  // TODO: comment code
  private async CreateLens(group, range, isRoot = false) {
    let lens
    let r = (!range ? new Range(0,0,0,0) : range)
    let c = 0
    let key = group.keywords.join('').toUpperCase()
    let items = []

    for(let k of group.keywords) {
      let f = (await Annotations.getInstance().getAsync(k, (!range ? null : r)))
      if(!f) return []
      for(let t of f) {
        items.push({
          label: t.index + '',
          detail: t.text.trim(),
          description: k.toUpperCase()
        })
      }
      c += f.length
    }

    let s = Annotations.getInstance().createGroupString(group.text,c)
    if(s != null) {
      if(isRoot) {
       
        GroupItems.groups[key] = {
          items
        }
        
        Commands.getInstance().register('provisionlens.list.' + key, () => {
          Commands.getInstance().list(key)
        })

        let vtype = this.settings.get('fileOverview', 'both')
        switch(vtype) {
          case 'both': {
            await Statusbarprovider.getInstance().change(group, s)
            lens = new CodeLens(r, {
              command: 'provisionlens.list.' + key,
              title: s,
              tooltip: group.tooltip
            })
            break
          }
          case 'top': {
            lens = new CodeLens(r, {
              command: 'provisionlens.list.' + key,
              title: s
            })
            break
          }
          case 'statusbar': {
            await Statusbarprovider.getInstance().change(group, s)
            break
          }
        }

      } else {
        // add the lens for this group
        lens = new CodeLens(r, {
          command: 'provisionlens.list',
          arguments: [{
            items
          }],
          title: s,
          tooltip: group.tooltip
        })
      }

    }
    return lens
  }
}