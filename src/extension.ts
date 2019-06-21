import * as vscode from 'vscode'
import LensManager from './tools/LensManager'
import ProvisionBase from './common/ProvisionBase'
import DocumentManager from './common/DocumentManager'
import DocumentItems, { DocumentItem } from './common/Documentitems'
import Commands from './tools/Commands'
import HighlightManager from './tools/HighlightManager'

const modules: ProvisionBase[] = []
export function activate(context: vscode.ExtensionContext) {
	let docManager = new DocumentManager(context)
	docManager.onUpdate(data => {
		update(data)
	})
	docManager.onLateUpdate(data => {
		lateUpdate(data)
	})
	docManager.onConfigChanged(() => {
		modules.forEach(m => {
			m.onConfigChanged()
		})
	})

	// register all the modules here
	let commands = new Commands(context)
	modules.push(commands)
	let lens = new LensManager()
	modules.push(lens)
	let highlighter = new HighlightManager()
	modules.push(highlighter)

	modules.forEach(m => {
		let dis = m.initialize()
		if(!!dis) context.subscriptions.push(...dis)		
	})

	setTimeout(() => {
		docManager.start(data => {
			update(data)
		}, (data) => {
			lateUpdate(data)
		})
	}, 100)
}

function update(data: DocumentItem | undefined) {
	modules.forEach(m => {
		m.update(data)
	})
}

function lateUpdate(data: DocumentItems | undefined) {
	modules.forEach(m => {
		m.lateUpdate(data)
	})
}

// this method is called when your extension is deactivated
export function deactivate() {
	modules.forEach(m => {
		m.deactivate()
	})
}
