// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
// const vscode = require('vscode')
import {commands, languages} from 'vscode'
import TodoLensProvider from '../lib/todolens/TodoLensProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// const config = new App
	const disposables = []
	
	disposables.push(
		commands.registerCommand("todolens.toggleLens", () => {
				// config.codeMetricsDisplayed = !config.codeMetricsDisplayed;
				// triggerCodeLensComputation();
		})
	)
	let docSelector = {
    language: "*",
    scheme: "file"
	}
	
	languages.registerCodeLensProvider(
		docSelector,
		new TodoLensProvider()
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
