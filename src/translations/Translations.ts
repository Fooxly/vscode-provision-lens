import { workspace } from 'vscode';
import { GroupTextObject } from '../common/options/GroupItem'

export default class Translations {
  public static DEFAULT_TRANSLATIONS = {
    noNoteFound: "No notes found past the current point",
    dropdownText: "The following notes are found",
    key_not_found: "The following keyword is not defined: "
  }

  public static getTranslation(key: string): string {
    let lang: any = workspace.getConfiguration('provision').get('translations', Translations.DEFAULT_TRANSLATIONS)
    if(!lang[key]) return ''
    return lang[key]
  }

  public static createOverviewTitle(group: string | GroupTextObject, count: number): string {
    let s
    if(typeof group === 'string') {
      s = group
    } else {
      if(count > 1 || count === 0) {
        s = group.multiple
      } else {
        s = group.one
      }
    }
    s = s.replace('{0}', count.toString())
    return s
  }

}