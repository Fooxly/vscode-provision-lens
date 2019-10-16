import { languages, ConfigurationTarget, commands } from 'vscode'
import Main from '../core/Main'
import Lens from './Lens'
import BaseCommands from '../core/BaseCommands'
import Document from '../core/document'
import { DocumentListener } from '../core/document/DocumentListener'

export default class Hub extends Main implements DocumentListener {
  public document?: Document
  private lens?: Lens
  protected initialize() {
    this.document = new Document(this)
    this.document.addListener(this)
    this.lens = new Lens(this)

    let m: string[] = this.config.get<string[]>('modules', [])

    this.registerCommand('provision.popup', args => BaseCommands.Popup(this, args), true)
    
    // Provision wide commands
    commands.getCommands().then(e => {
      if(e.indexOf('provision.help') === -1) {
        this.registerCommand('provision.help', args => BaseCommands.Help(this, args), false)
      }
    })
    
    this.disposables.push(languages.registerCodeLensProvider({
      language: '*',
      scheme: 'file'
    }, this.lens))
  }

  protected configChanged() {
    let m: string[] = this.config.get<string[]>('modules', [])
    if(!m.length || m.indexOf(this.UUID)  === -1) {
      m.push(this.UUID)
    }
    this.config.update('modules', m, ConfigurationTarget.Global)
    if(this.lens) this.lens.configChanged()
  }

  protected dispose() {
    if(this.lens) this.lens.dispose()
   }

  public update(data?: any) {
    if(this.lens) this.lens.update(data)
  }

  public detailedUpdate(data?: any)  {
    if(this.lens) this.lens.detailedUpdate(data)
  }
}