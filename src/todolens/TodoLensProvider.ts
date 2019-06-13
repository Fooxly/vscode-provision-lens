import { workspace, CodeLensProvider, Range, Command, CodeLens, TextDocument, CancellationToken } from 'vscode'
export default class TodoLensProvider implements CodeLensProvider {

  settings
  annotations = {

  }

  async provideCodeLenses(doc : TextDocument) : Promise<CodeLens[]> {
    this.settings = workspace.getConfiguration('todolens')
    // console.log(doc)
    let r = new Range(0,0,0,0)
    let lenses = []
    
    this.annotations = this.searchAnnotations(doc, this.settings.get('types', []))
    this.settings.get('types', []).forEach(type => {
      let c = 0
      type.types.forEach(t => {
        c += this.annotations[t].length
      })
      lenses.push(new CodeLens(r, {
        command: "todolens.list",
        arguments: [type.types.join('|')],
        title: this.createString(type, c)
      }))


      // let s = this.createString(doc, t)
      // if(!s) return
      // lenses.push(new CodeLens(r, {
      //   command: "todolens.list",
      //   title: s
      // }))
    })
    return lenses
  }


  createString(t, c) {
    let r = t.title
    if(this.settings.get('hideWhenZero', true) && !c) return null
    return r.replace('{0}', c)
  }

  searchAnnotations(doc: TextDocument, types) : Object {
    const r = {}
    let text = doc.getText()

    types.forEach(type => {
      type.types.forEach(t => {
        let regex
        // if case sensetive
        if(this.settings.get('caseSensitive', false)) {    
          regex = new RegExp(`\\b(${t})\\b`, 'gm')
        } else {
          regex = new RegExp(`\\b(${t})\\b`, 'igm')
        }
        if(r[t] == null) r[t] = []
        text.split(/\r?\n/).map((l, i) => {
          if(regex.test(l)) {
            r[t].push({
              l,
              i: i + 1
            })
          }
        }).filter(Boolean)
      })
    })

    return r
  }

  searchAnnotation(doc: TextDocument, type) : Number {
    let vals = type.types.join('|')
    let regex
    // if case sensetive
    if(this.settings.get('caseSensitive', false)) {    
      regex = new RegExp(`\\b(${vals})\\b`, 'gm')
    } else {
      regex = new RegExp(`\\b(${vals})\\b`, 'igm')
    }
    return (doc.getText().match(regex) || []).length;
  }
}