import {commands, languages, window, QuickPickItem, Selection, workspace} from 'vscode'
import TodoLensProvider from './lens/TodoLensProvider'
import Utils from './common/Utils'

var lens, highlight, annotations, activeEditor

function activate(context) {
	const disposables = []

	activeEditor = window.activeTextEditor

	annotations = Utils.searchAnnotations()
	lens = new TodoLensProvider()
	// lens
	
	
	disposables.push(
		languages.registerCodeLensProvider({
				language: "*",
				scheme: "file"
			},
			lens
		)
	)

	if(activeEditor) {
		updateAnnotations()
	}

	window.onDidChangeActiveTextEditor((e) => {
		activeEditor = e
		if(e) {
			updateAnnotations()
		}
	}, null, context.subscriptions)
	workspace.onDidChangeTextDocument((e) => {
		if(activeEditor && e.document == activeEditor.document) {
			updateAnnotations()
		}
	}, null, context.subscriptions)

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
				lens.annotations[a].forEach(t => {
					arr.push({
						label: t.index + '',
						description: t.text.trim()
					})
				})
			})
			
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

	context.subscriptions.push(...disposables)
}
exports.activate = activate

function updateAnnotations() {
	annotations = Utils.searchAnnotations()
	lens.Update(annotations)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
