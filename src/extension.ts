import {languages, window, QuickPickItem, Selection, workspace, Uri, FileSystemError, Range, Position} from 'vscode'
import TodoLensProvider from './lens/TodoLensProvider'
import Annotations from './common/annotations/Annotations'
import Highlighter from './syntax/Highlighter'
import Commands from './common/Commands'
import TodoBase from './common/TodoBase'

const modules : TodoBase[] = []

var lens, highlight, commands, annotations, activeEditor

function activate(context) {
	const disposables = []
	activeEditor = window.activeTextEditor

	annotations = new Annotations()
	modules.push(annotations)
	highlight = new Highlighter(annotations)
	modules.push(highlight)
	lens = new TodoLensProvider(annotations)
	modules.push(lens)
	commands = new Commands(annotations)
	modules.push(commands)

	// list command
	disposables.push(...commands.get())

	// add the lens to the disposables
	disposables.push(
		languages.registerCodeLensProvider({
				language: "*",
				scheme: "file"
			},
			lens
		)
	)

	setupEvents(context)
	update()

	context.subscriptions.push(...disposables)
}

/*
 * Setup all the window / workspace events here
 */
function setupEvents(context) {
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
}

/*
 * Update all the modules
 */
function update() {
	modules.forEach(m => {
		m.update()
	})
}

/*
 * Apply the config changes to the modules
 */
function configChanged() {
	modules.forEach(m => {
		m.configChanged()
	})
	this.update()
}

function deactivate() {}

exports.activate = activate
module.exports = {
	activate,
	deactivate
}
