import DocumentUtils from './document/DocumentUtils'
import { QuickPickItem, window, ViewColumn } from 'vscode'
import Main from './Main'

export const Popup = (main: Main, args: any) => {
  if (args.items) {
    if (args.items.length === 0) return
    if (args.items.length === 1 && main.config.get('moveOnSingle', true)) {
      return DocumentUtils.moveToLine(args.items[0].range.start.line)
    }
    let quickpick: QuickPickItem[] = []
    for (let item of args.items) {
      const s = item.text.slice(item.range.start.character, item.text.length)
      quickpick.push({
        label: (item.range.start.line + 1).toString(),
        detail: s.trim(),
        description: item.keyword
      })
    }
    switch (main.config.get<string>('popup.sorting', 'line_numbers_asc')) {
      case 'line_numbers_asc': {
        quickpick = quickpick.sort((a, b) => parseInt(a.label, 10) - parseInt(b.label, 10))
        break
      }
      case 'line_numbers_desc': {
        quickpick = quickpick.sort((a, b) => parseInt(b.label, 10) - parseInt(a.label, 10))
        break
      }
    }

    window.showQuickPick(quickpick, {
      canPickMany: false,
      placeHolder: 'Select a note'
    }).then(v => {
      if (!v) return
      DocumentUtils.moveToLine(Number(v.label) - 1)
    })
  }
  return true
}

export const List = (main: Main, data?: any) => {
  const items = []
  for (const k in data) {
    if (data.hasOwnProperty(k)) {
      items.push(...data[k].items)
    }
  }
  Popup(main, { items })
}

export const Help = () => {
  let col: ViewColumn = ViewColumn.One
  if(window.activeTextEditor && window.activeTextEditor.viewColumn) col = window.activeTextEditor.viewColumn
  let v = window.createWebviewPanel('provision', 'Provivision Manual', {
    preserveFocus: false,
    viewColumn: col
  }, {
    enableScripts: true
  })
  v.webview.html = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cat Coding</title>

      <style>
        html, body, iframe {
          height: 100%;
          width: 100%;
          margin: 0;
          padding: 0;
          overflow: hidden;
          border: 0;
        }
      </style>
  </head>
  <body>
      <iframe src="https://developer.fooxly.com/extensions/provision/guide" width="100%" height="100%" />
  </body>
  </html>`
}

export default {
  Popup,
  List,
  Help
}