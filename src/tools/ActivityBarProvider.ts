import { TreeDataProvider, Uri, TreeItem, Event, TreeItemCollapsibleState, workspace, ThemeIcon } from 'vscode'
import * as fs from 'fs'
import * as path from 'path'
import DocumentManager from '../common/DocumentManager'

export default class ActivityBarProvider implements TreeDataProvider<ProvisionEntry> {
  onDidChangeTreeData?: Event<ProvisionEntry | null | undefined> | undefined

  constructor(private documentManager: DocumentManager) {}

  getTreeItem(element: ProvisionEntry): TreeItem | Thenable<TreeItem> {
    if(!element.uri && !element.text) return new TreeItem('No notes found', TreeItemCollapsibleState.None)

    if(element.type === ProvisionType.NOTE) {
      const treeItem = new TreeItem((element.text ? element.text : 'No text'), element.type !== ProvisionType.NOTE ? TreeItemCollapsibleState.Collapsed : TreeItemCollapsibleState.None)
      treeItem.command = {
        command: 'provisionlens.moveToNote',
        title: 'Open',
        arguments: [{
          uri: element.uri, 
          line: element.line
        }]
      }
      return treeItem
    }

    if(!element.uri) return new TreeItem('No notes found', TreeItemCollapsibleState.None)
    const treeItem = new TreeItem(element.uri, TreeItemCollapsibleState.Collapsed)
    if(element.type === ProvisionType.FILE) {
      if(!element.uri) {
        treeItem.collapsibleState = TreeItemCollapsibleState.None
      } else {
        treeItem.resourceUri = Uri.file(element.uri.fsPath)
        treeItem.tooltip = element.uri.fsPath
      }
      treeItem.iconPath = ThemeIcon.File
    }
    return treeItem
  }

  async readDirectory(uri: string): Promise<[string, ProvisionType][]> {
    return new Promise((resolve, reject) => {
      fs.readdir(uri, (err, children) => {
        if(err) reject(err)
        const result: [string, ProvisionType][] = []
        for(let i = 0; i < children.length; i++) {
          const child: string = children[i]
          const stat: FileStat = new FileStat(fs.statSync(path.join(uri, child)))
          result.push([child, stat.type])
        }
        resolve(result)
      })
    })
  }

  async getChildren(element?: ProvisionEntry | undefined): Promise<ProvisionEntry[]> {
    if(element && element.uri) {
      if(element.type === ProvisionType.DIRECTORY) {
        const children = await this.readDirectory(element.uri.fsPath)
        let uri = element.uri
        return children.map(([name, type]) => ({ uri: Uri.file(path.join(uri.fsPath, name)), type }))
      }
      if(element.type === ProvisionType.FILE) {
        // read all the notes in this file
        const data = await this.documentManager.getNotesFromFile(element.uri.fsPath)
        return data.map(d => ({
          uri: element.uri,
          type: ProvisionType.NOTE,
          text: d[0],
          line: d[1]
        }))
      }
      return []
    }

    if(!workspace.workspaceFolders) return [{
      uri: undefined,
      type: ProvisionType.EMPTY
    }]
    const workspaceFolder = workspace.workspaceFolders.filter(folder => folder.uri.scheme === 'file')[0]
		if (workspaceFolder) {
			const children = await this.readDirectory(workspaceFolder.uri.fsPath)
			children.sort((a, b) => {
				if (a[1] === b[1]) {
					return a[0].localeCompare(b[0]);
				}
				return a[1] === ProvisionType.DIRECTORY ? -1 : 1
			});
			return children.map(([name, type]) => ({ uri: Uri.file(path.join(workspaceFolder.uri.fsPath, name)), type }))
		}

    return []
  }


}

export interface ProvisionEntry {
  uri?: Uri
  type: ProvisionType
  text?: string
  line?: number
}

class FileStat {
  constructor(private fsStat: fs.Stats) {}
  get type(): ProvisionType {
    return this.fsStat.isFile() ? ProvisionType.FILE : this.fsStat.isDirectory() ? ProvisionType.DIRECTORY : ProvisionType.NOTE
  }
}

enum ProvisionType {
  NOTE,
  FILE,
  DIRECTORY,
  EMPTY
}