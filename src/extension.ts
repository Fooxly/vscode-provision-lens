import * as vscode from 'vscode';

import ProVision from './ProVision';
import ProVisionLensProvider from './ProVisionLensProvider';

const disposables: vscode.Disposable[] = [];
let lensProvider: ProVisionLensProvider | undefined = undefined;
let enabled = true;

export function activate(context: vscode.ExtensionContext) {
	// Initialize the ProVision Core
	ProVision.initialize(context);

	disposables.push(vscode.commands.registerCommand('ProVision.lens.toggle', handleToggle));

	createLensProvider();
}

export function deactivate() {
	if (lensProvider) lensProvider.dispose();
	for (const disposable of disposables) {
        disposable.dispose();
    }
	ProVision.destroy();
}

const handleToggle = () => {
	enabled = !enabled;
	if (lensProvider) {
		if (!enabled) lensProvider.disable();
		else lensProvider.enable();
	}
};

const createLensProvider = () => {
	lensProvider = new ProVisionLensProvider();
	disposables.push(vscode.languages.registerCodeLensProvider({
		language: '*',
		scheme: 'file'
	}, lensProvider));
};
