import {languages, window, workspace} from 'vscode'
import ProvisionLensProvider from './lens/provisionlensProvider'
import Annotations from './common/annotations/Annotations'
import Highlighter from './syntax/Highlighter'
import Commands from './common/Commands'
import ProvisionBase from './common/ProvisionBase'
import StatusbarProvider from './statusbar/StatusbarProvider'

const modules : ProvisionBase[] = []

var lens, highlight, statusbar, commands, annotations, activeEditor
var initialized = false

function activate(context) {
	const disposables = []
	activeEditor = window.activeTextEditor
	
	commands = new Commands(context)
	modules.push(commands)
	
	annotations = new Annotations()
	modules.push(annotations)

	highlight = new Highlighter()
	modules.push(highlight)
	lens = new ProvisionLensProvider()
	modules.push(lens)
	statusbar = new StatusbarProvider()
	modules.push(statusbar)

	// list command
	commands.defaults()

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
	initialized = true
	exludedFilesUpdate()
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

	workspace.onDidSaveTextDocument(async (doc) => {
		if(annotations.checkIgnoreUpdate(doc)) {
			exludedFilesUpdate()
		}
	})

	workspace.onDidChangeConfiguration(() => {
		configChanged()
	}, null, context.subscriptions)
}

/*
 * Update all the modules
 */
function update() {
	if(!initialized) return
	modules.forEach(m => {
		m.update()
	})
}

async function exludedFilesUpdate() {
	await annotations.updateIgnore()
	update()
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

function deactivate() {
	modules.forEach(m => {
		m.deactivate()
	})
}

exports.activate = activate
module.exports = {
	activate,
	deactivate
}
