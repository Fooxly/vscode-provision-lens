import { commands, window, Selection, Range, Position, workspace, QuickPickItem, Command, Disposable } from 'vscode'
import * as _ from 'lodash'
import TodoBase from './TodoBase'
import Annotations from './annotations/Annotations'

export default class Commands extends TodoBase {
  private annotations : Annotations

  constructor(annotations : Annotations) {
    super()
    this.annotations = annotations
	}
	
	/**
	 * Create and get all the commands for this extension
	 */
  public get() : Array<Disposable> {
    // list all the notes from the current file in a dropdown
    let list = commands.registerCommand('todolens.list', (args) => {
			// get all the items
			let arr : Array<QuickPickItem> = []
			let an
			if(args != undefined) {
				an = args.keywords
			} else {
				// get all keywords
				an = this.annotations.getKeywords()
			}
			// filter out possible duplicates
			an = _.uniqBy(an, (e) => {return e})
			// get all the values by the given types
			an.forEach(a => {
				this.annotations.get(a, (!args ? null : args.range)).then((files) => {
					files.forEach(t => {
						arr.push({
							label: t.index + '',
							description: t.text.trim()
						})
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
      let l = this.annotations.getPreviousNoteLocation()
      // return a info message if there are no notes found above the cursors position
      if(!l) return window.showInformationMessage(this.language.noNoteFound)
      this.moveToLine(l)
    })

    let next = commands.registerCommand('todolens.nextNote', () => {
      let l = this.annotations.getNextNoteLocation()
      // return a info message if there are no notes found below the cursors position
      if(!l) return window.showInformationMessage(this.language.noNoteFound)
      this.moveToLine(l)
    })
    return [list, last, next]
  }

	/**
	 * Move the cursor to the specified line
	 * @param line: The line where it needs to go
	 */
  private moveToLine(line) {
    let editor = window.activeTextEditor
    if(!editor) return
    let range = editor.document.lineAt(line-1).range
    editor.selection =  new Selection(range.start, range.start)
    editor.revealRange(new Range(range.start, new Position(range.end.line + (editor.visibleRanges[0].end.line - editor.visibleRanges[0].start.line) - 3, range.end.character)))
  }
}