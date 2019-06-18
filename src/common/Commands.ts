import { commands, window, Selection, Range, Position, QuickPickItem, Disposable } from 'vscode'
import * as _ from 'lodash'
import ProvisionBase from './ProvisionBase'
import Annotations from './annotations/Annotations'
import GroupItems from './groups/GroupItems'

export default class Commands extends ProvisionBase {
  private static instance : Commands
  private context

  private commands : string[] = []

  constructor(context) {
    super()
    this.context = context
    Commands.instance = this
  }
  
  public static getInstance() {
    return this.instance
  }

  public register(uri, func) {
    if(this.commands.includes(uri)) return
    this.context.subscriptions.push(commands.registerCommand(uri, func))
    this.commands.push(uri)
  }

  public list(key) {
    if(!GroupItems.groups[key]) return
    let arr : QuickPickItem[] = GroupItems.groups[key].items
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
  }

	/**
	 * Create and get all the commands for this extension
	 */
  public defaults() {
    this.register('provisionlens.listall', async () => {
      let arr : Array<QuickPickItem> = await Annotations.getInstance().getAllItemsInFile()

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

    this.register('provisionlens.list', async (args) => {
			// get all the items
			let arr : Array<QuickPickItem> = []
      if(!args) return
      arr = args.items
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

    this.register('provisionlens.lastNote', () => {
      let l = Annotations.getInstance().getPreviousNoteLocation()
      // return a info message if there are no notes found above the cursors position
      if(!l) return window.showInformationMessage(this.language.noNoteFound)
      this.moveToLine(l)
    })
    this.register('provisionlens.nextNote', () => {
      let l = Annotations.getInstance().getNextNoteLocation()
      // return a info message if there are no notes found below the cursors position
      if(!l) return window.showInformationMessage(this.language.noNoteFound)
      this.moveToLine(l)
    })
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