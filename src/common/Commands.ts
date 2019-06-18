import { commands, window, Selection, Range, Position, QuickPickItem, Disposable } from 'vscode'
import * as _ from 'lodash'
import ProvisionBase from './ProvisionBase'
import Annotations from './annotations/Annotations'

export default class Commands extends ProvisionBase {
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
    let list = commands.registerCommand('provisionlens.list', async (args) => {
			// get all the items
			let arr : Array<QuickPickItem> = []
			if(args != undefined) {
				arr = args.items
			} else {
				// get all items from the current document
				arr = await this.annotations.getAllItemsInFile()
			}
			// filter out possible duplicates
			let o = this.settings.get('dropdownOrdering', 'line_numbers_asc')
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
    
    let last = commands.registerCommand('provisionlens.lastNote', () => {
      let l = this.annotations.getPreviousNoteLocation()
      // return a info message if there are no notes found above the cursors position
      if(!l) return window.showInformationMessage(this.language.noNoteFound)
      this.moveToLine(l)
    })

    let next = commands.registerCommand('provisionlens.nextNote', () => {
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