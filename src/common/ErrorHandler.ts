import { window } from 'vscode'

export default class ErrorHandler {
  private given_codes: string[] = []

  private static instance: ErrorHandler

  public static getInstance(): ErrorHandler {
    if(!this.instance) this.instance = new ErrorHandler()
    return this.instance
  }

  public error(code: string, msg: string, ignoreSendBefore: boolean = false) {
    if(!ignoreSendBefore) {
      if(this.given_codes.includes(code)) return
    }
    this.given_codes.push(code)
    // show the error message
    window.showErrorMessage(msg)
  }
}