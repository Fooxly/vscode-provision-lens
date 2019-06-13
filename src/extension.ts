import {commands, languages, window, QuickPickItem, Selection, workspace, Uri, FileSystemError} from 'vscode'
import * as _ from 'lodash'
import TodoLensProvider from './lens/TodoLensProvider'
import Annotations from './common/Annotations'
import Highlighter from './syntax/Highlighter'

var lens, highlight, annotations, activeEditor, settings

function activate(context) {
	const disposables = []

	settings = workspace.getConfiguration('todolens')
	activeEditor = window.activeTextEditor
	annotations = new Annotations()
	highlight = new Highlighter(annotations)
	lens = new TodoLensProvider(annotations)

	// list command
	disposables.push(
		commands.registerCommand("todolens.list", (args) => {
			// get all the items
			let arr : Array<QuickPickItem> = []
			let an
			if(args != undefined) {
				an = args.split('|')
			} else {
				// get all annotations
				an = annotations.getAll()
			}
			// filter out possible duplicates
			an = _.uniqBy(an, (e) => {return e})
			// get all the values by the given types
			an.forEach(a => {
				annotations.get(a).forEach(t => {
					arr.push({
						label: t.index + '',
						description: t.text.trim()
					})
				})
			})
			let o = settings.get('dropdownOrdering', 'category')
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
				let editor = window.activeTextEditor
				let range = editor.document.lineAt(Number(v.label)-1).range
				editor.selection =  new Selection(range.start, range.start)
				editor.revealRange(range)
			})
		})
	)

	// events
	window.onDidChangeActiveTextEditor((e) => {
		activeEditor = e
		if(e) {
			update()
		}
	}, null, context.subscriptions)
	
	workspace.onDidChangeTextDocument((e) => {
		if(activeEditor && e.document == activeEditor.document) {
			update()
		}
	}, null, context.subscriptions)

	workspace.onDidChangeConfiguration(() => {
		configChanged()
	}, null, context.subscriptions)

	disposables.push(
		languages.registerCodeLensProvider({
				language: "*",
				scheme: "file"
			},
			lens
		)
	)

	update()
	context.subscriptions.push(...disposables)
}
exports.activate = activate

function update() {
	annotations.update()
	if(settings.get('useHighlighting', true)) highlight.update()
}
function configChanged() {
	settings = workspace.getConfiguration('todolens')
	// annotations.configChanged()
	if(settings.get('useHighlighting', true)) highlight.configChanged()
	this.update()
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
