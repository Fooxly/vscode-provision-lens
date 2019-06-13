// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode')
import {commands, languages, window, QuickPickItem, Selection} from 'vscode'
import TodoLensProvider from './todolens/TodoLensProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	const disposables = []
	const lens = new TodoLensProvider()
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
						label: t.i + '',
						description: t.l.trim()
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
	let docSelector = {
    language: "*",
    scheme: "file"
	}
	
	languages.registerCodeLensProvider(
		docSelector,
		lens
	)

	context.subscriptions.push(...disposables)
}
exports.activate = activate

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
