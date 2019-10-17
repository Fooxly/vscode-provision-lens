import { languages, commands } from 'vscode'

import Lens from './Lens'
import Main from '../core/Main'
import Document from '../core/document'
import BaseCommands from '../core/BaseCommands'
import { DocumentListener } from '../core/document/DocumentListener'

export default class Hub extends Main implements DocumentListener {
  public document?: Document
  private lens?: Lens
  private data?: any

  protected initialize () {
    this.document = new Document(this)
    this.document.addListener(this)
    this.lens = new Lens(this)

    this.registerCommand('provision.popup', args => BaseCommands.Popup(this, args), true)
    
    // Provision wide commands
    commands.getCommands().then(e => {
      if (e.indexOf('provision.help') === -1) {
        this.registerCommand('provision.help', () => BaseCommands.Help(), false)
        this.registerCommand('provision.list', () => BaseCommands.List(this, this.data), false)
      }
    })
    
    this.disposables.push(languages.registerCodeLensProvider({
      language: '*',
      scheme: 'file'
    }, this.lens))
  }

  protected configChanged () {
    if (this.lens) this.lens.configChanged()
  }

  protected dispose () {
    if (this.lens) this.lens.dispose()
   }

  public update (data?: any) {
    this.data = data
    if (this.lens) this.lens.update(data)
  }

  public detailedUpdate (data?: any)  {
    if (this.lens) this.lens.detailedUpdate(data)
  }
}
