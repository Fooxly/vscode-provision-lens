import * as vscode from 'vscode';

import { getCountForGroup, getDocumentSymbols } from './ProVision/DocumentHelper';
import { Group } from './ProVision/types';
import { getGroups } from './ProVision/utils';

export default class ProVisionLensProvider implements vscode.CodeLensProvider {
    private lenses: vscode.CodeLens[] = [];
    private config: vscode.WorkspaceConfiguration | undefined = undefined;

    constructor () {
        // Setup all the configruation settings
        this.handleConfigUpdate();
        // Listen for config changes to apply
        vscode.workspace.onDidChangeConfiguration(() => {
            this.handleConfigUpdate();
        });
    }

    public provideCodeLenses (document: vscode.TextDocument): vscode.ProviderResult<vscode.CodeLens[]> {
        // If there is no active document, the items should be removed
        if (!document) return;
        
        return new Promise((resolve) => {
            this.lenses = [];
            const scope: Scope = this.config?.get<Scope>('lens.scope') ?? 'file';
            const groups = getGroups();
            
            const filePromise = new Promise((result) => {
                // show items at top of file for the file scope
                const lenses: vscode.CodeLens[] = [];
                if (scope === 'file' || scope === 'both') {
                    for (const group of groups) {
                        const count = getCountForGroup(group, document);
                        const fileLens = this.addLensForGroup(group, new vscode.Range(
                            new vscode.Position(0,0),
                            new vscode.Position(document.lineCount, 0)
                        ), count);
                        if (fileLens) lenses.push(fileLens);
                    }
                }
                result(lenses);
            });
    
            const functionPromise = new Promise((result) => {
                // show items at top of file for the file scope
                if (scope === 'functions' || scope === 'both') {
                    getDocumentSymbols(document).then(symbols => {
                        const lenses: vscode.CodeLens[] = [];
                        if (!symbols) return;
                        for (const symbol of symbols) {
                            for (const group of groups) {
                                const fileLens = this.addLensForGroup(group, symbol.range, getCountForGroup(group, document, symbol.range));
                                if (fileLens) lenses.push(fileLens);
                            }
                        }
                        result(lenses);
                    });
                } else {
                    result([]);
                }
            });
    
            Promise.all([filePromise, functionPromise]).then((lenses) => {
                for (const lensArr of lenses) {
                    this.lenses.push(...lensArr as vscode.CodeLens[]);
                }
                resolve(this.lenses);
            });
        });
    }

    private addLensForGroup (group: string, range: vscode.Range, count: number): vscode.CodeLens | undefined {
        if (!count) return;
        const groupProps: Group | undefined = this.config?.get<any | undefined>('groups')?.[group];
        return (
            new vscode.CodeLens(range,
                {
                    command: 'ProVision.listGroup',
                    arguments: [group, range],
                    tooltip: group.charAt(0).toUpperCase() + group.slice(1).toLowerCase(),
                    title: !groupProps?.title
                                ? `${group.charAt(0).toUpperCase() + group.slice(1).toLowerCase()} (${count})`
                                : typeof groupProps.title === 'string'
                                    ? groupProps.title.replace('{0}', count.toString())
                                    : count === 1 && groupProps.title['1']?.length
                                        ? groupProps.title['1'].replace('{0}', count.toString())
                                        : groupProps.title['*'].replace('{0}', count.toString())
                }
            )
        );
    }

    public dispose () {
      this.lenses = [];
    }

    private handleConfigUpdate = () => {
	    this.config = vscode.workspace.getConfiguration('ProVision');
    };
}
