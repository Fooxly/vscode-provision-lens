export default interface GroupItem {
  keywords: string[]
  tooltip: string
  text: string | GroupTextObject
}

export interface GroupTextObject {
  one: string
  multiple: string
}