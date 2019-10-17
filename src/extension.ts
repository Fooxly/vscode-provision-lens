import { ExtensionContext } from 'vscode'
import Hub from './main/Hub'

let hub: Hub

export function activate(context: ExtensionContext) {
	hub = new Hub(context, 'provision.lens')
}

export function deactivate() {
	hub._dispose()
}
