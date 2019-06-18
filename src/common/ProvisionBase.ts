import { workspace, window } from 'vscode'
import Translations from './Translations'

export default abstract class ProvisionBase {
  protected settings
  protected language
  constructor() {
    this.configChanged()
  }
  public update(){}
  public configChanged(){
    this.settings = workspace.getConfiguration('provisionlens')
    this.language = this.settings.get('translations', Translations.DEFAULT_TRANSLATIONS)
    Object.keys(Translations.DEFAULT_TRANSLATIONS).forEach(k => {
      if(!this.language[k]) this.language[k] = Translations.DEFAULT_TRANSLATIONS[k]
    })
  }
}
