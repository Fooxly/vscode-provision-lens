import Main from './Main'
import { Groups } from './structs/Settings'

export default class Utils {
  public static getKeywords(main: Main) {
    return main.config.get('keywords', {})
  }

  public static getGroup(main: Main, keyword: string) {
    let groups: Groups[] = main.config.get<Groups[]>('groups', [])
    let result: string | undefined
    for(let g of groups) {
      if(g.keywords.indexOf(keyword) > -1) {
        result = 'groups.' + g.keywords.join('_')
        break
      }
    }
    if(!result) return keyword
    return result
  }

  public static getGroupProps(main: Main, group: string) {
    let groups: Groups[] = main.config.get<Groups[]>('groups', [])
    let keywords: any = main.config.get('keywords', {})
    let result: any = {}
    if(group.startsWith('groups.')) {
      for(let g of groups) {
        if('groups.' + g.keywords.join('_') === group) {
          result = g
          // Get props from the first keyword if their info is missing inside the group
          if(!g.title) result.title = keywords[g.keywords[0]].title
          if(!g.tooltip) result.tooltip = keywords[g.keywords[0]].tooltip
          break
        }
      }
    } else {
      result = keywords[group]
    }
    return result
  }
}