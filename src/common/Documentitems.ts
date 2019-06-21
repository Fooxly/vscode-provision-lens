import { Range } from 'vscode'

export default interface DocumentItems {
  items: DocumentItem[],
  root: DocumentItem | null
}

export interface DocumentItem {
  container_start: Range
  isRoot: boolean
  items: any
}

export interface DocumentItemGroupObject {
  keywords: string[]
  size: number
  items: DocumentItemGroup[]
}

export interface DocumentItemGroup {
  keyword: string,
  keyword_settings: any | undefined,
  text: string
  range: Range
}