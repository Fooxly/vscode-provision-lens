export interface DocumentListener {
  update(data?: any): void
  detailedUpdate(data?: any): void
}