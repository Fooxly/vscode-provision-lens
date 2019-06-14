import { commands, window, Selection, Range, Position, workspace, QuickPickItem } from 'vscode'
import * as _ from 'lodash'
import TodoBase from './TodoBase'
import Annotations from './Annotations'

export default class Commands extends TodoBase {
  private annotations : Annotations

  constructor(ann) {
    super()
    this.annotations = ann
  }

  public get() {
    // list all the notes from the current file in a dropdown
    let list = commands.registerCommand('todolens.list', (args) => {
			// get all the items
			let arr : Array<QuickPickItem> = []
			let an
			if(args != undefined) {
				an = args.split('|')
			} else {
				// get all keywords
				an = this.annotations.getKeywords()
			}
			// filter out possible duplicates
			an = _.uniqBy(an, (e) => {return e})
			// get all the values by the given types
			an.forEach(a => {
				this.annotations.get(a).forEach(t => {
					arr.push({
						label: t.index + '',
						description: t.text.trim()
					})
				})
			})
			let o = this.settings.get('dropdownOrdering', 'category')
			switch(o) {
				case 'line_numbers_asc': {
					arr = _.orderBy(arr, [(r) => {return Number(r.label)}], ['asc'])
					break
				}
				case 'line_numbers_desc': {
					arr = _.orderBy(arr, [(r) => {return Number(r.label)}], ['desc'])
					break
				}
			}
			// show the quick picker
			window.showQuickPick(arr, {canPickMany: false})
			.then((v) => {
        if(!v) return
        this.moveToLine(Number(v.label))
      })
    })
    
    let last = commands.registerCommand('todolens.lastNote', () => {
      this.moveToLine(this.annotations.getPreviousNoteLocation())
    })

    let next = commands.registerCommand('todolens.nextNote', () => {
      this.moveToLine(this.annotations.getNextNoteLocation())
    })
    return [list, last, next]
  }

  private moveToLine(line) {
    let editor = window.activeTextEditor
    if(!editor) return
    let range = editor.document.lineAt(line-1).range
    editor.selection =  new Selection(range.start, range.start)
    editor.revealRange(new Range(range.start, new Position(range.end.line + (editor.visibleRanges[0].end.line - editor.visibleRanges[0].start.line) - 3, range.end.character)))
  
  }

}