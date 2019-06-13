import { Range, window, workspace } from 'vscode'

function searchAnnotations() : Object {
  let settings = workspace.getConfiguration('todolens')
  let activeEditor = window.activeTextEditor
  if (!activeEditor) {
    return
  }
  
  const r = {}
  let text = activeEditor.document.getText()
  settings.get('types', []).forEach(type => {
    type.types.forEach(t => {
      let regex
      // if case sensetive
      if(settings.get('caseSensitive', false)) {    
        regex = new RegExp(`\\b(${t})\\b`, 'gm')
      } else {
        regex = new RegExp(`\\b(${t})\\b`, 'igm')
      }
      if(r[t] == null) r[t] = []
      let match
      while(match = regex.exec(text)) {
        // console.log(match)
        let pos = activeEditor.document.positionAt(match.index)
        r[t].push({
          text: activeEditor.document.lineAt(pos).text,
          index: pos.line + 1,
          range: new Range(pos, activeEditor.document.positionAt(match.index + match[0].length))
        })
      }
    })
  })
  return r
}

export default {
  searchAnnotations
}