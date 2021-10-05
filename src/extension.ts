import * as vscode from 'vscode';

import ProVision from './ProVision';
import ProVisionLensProvider from './ProVisionLensProvider';

const disposables: vscode.Disposable[] = [];
let lensProvider: ProVisionLensProvider | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	// Initialize the ProVision Core
	ProVision.initialize(context);

	lensProvider = new ProVisionLensProvider();

	disposables.push(vscode.languages.registerCodeLensProvider({
		language: '*',
		scheme: 'file'
	}, lensProvider));
}

export function deactivate() {
	if (lensProvider) lensProvider.dispose();
	ProVision.destroy();
}