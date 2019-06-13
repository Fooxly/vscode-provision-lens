import {commands, languages, window, QuickPickItem, Selection, workspace} from 'vscode'
import TodoLensProvider from './lens/TodoLensProvider'
import Annotations from './common/Annotations'
import Highlighter from './common/Highlighter'

var lens, highlight, annotations, activeEditor

function activate(context) {
	const disposables = []

	activeEditor = window.activeTextEditor
	annotations = new Annotations()
	highlight = new Highlighter(annotations)
	lens = new TodoLensProvider(annotations)

	// list command
	disposables.push(
		commands.registerCommand("todolens.list", (args) => {
			// get all the items
			let arr : Array<QuickPickItem> = []
			let an = Object.keys(lens.annotations)
			if(args != undefined) {
				an = args.split('|')
			}
			an.forEach(a => {
				annotations.get(a).forEach(t => {
					arr.push({
						label: t.index + '',
						description: t.text.trim()
					})
				})
			})
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
	highlight.update()
}
function configChanged() {
	// annotations.configChanged()
	highlight.configChanged()
	this.update()
}

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
