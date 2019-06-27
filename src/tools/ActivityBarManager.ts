import { TreeView, ExtensionContext, window } from 'vscode';
import ActivityBarProvider, { ProvisionEntry } from './ActivityBarProvider'
import DocumentManager from '../common/DocumentManager'

export default class ActivityBarManager {
  private treeview: TreeView<ProvisionEntry>

  constructor(context: ExtensionContext, documentManager: DocumentManager) {
    const treeDataProvider = new ActivityBarProvider(documentManager)
    this.treeview = window.createTreeView('provision-notes', {treeDataProvider})
  }
}