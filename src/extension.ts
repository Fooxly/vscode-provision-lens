import { ExtensionContext, workspace, ConfigurationTarget } from 'vscode'
import Hub from './main/Hub'

let hub: Hub

export function activate(context: ExtensionContext) {
	// Converter from older versions
	convert()
	// start the extension
	hub = new Hub(context, 'provision.lens')
}

export function deactivate() {
	hub._dispose()
}

function convert() {
	const old = workspace.getConfiguration('provisionlens')
	if(!old.has('keywords')) return
	const current = workspace.getConfiguration('provision')
	if(Object.keys(current.get('keywords', {})).length) return
	const keywords: any = {}
	const oldKeywords: any = old.get('keywords', {})
	for (const ok of Object.keys(oldKeywords)) {
		keywords[ok] = {
			caseSensitive: oldKeywords[ok].caseSensitive ? oldKeywords[ok].caseSensitive : true,
			includesColon: oldKeywords[ok].useColons ? oldKeywords[ok].useColons : true,
		}
	}
	current.update('keywords', keywords, ConfigurationTarget.Global)
	const groups: any = []
	const oldGroups: any = old.get('groups', [])
	for(const og of oldGroups) {
		groups.push({
			keywords: og.keywords,
			title: {
				'1': og.text.one,
				'*': og.text.multiple
			}
		})
	}
	current.update('groups', groups, ConfigurationTarget.Global)
}
