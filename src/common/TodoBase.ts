import { workspace } from 'vscode';

export default abstract class TodoBase {
  protected settings
  constructor() {
    this.settings = workspace.getConfiguration('todolens')
  }
  public update(){}
  public configChanged(){
    this.settings = workspace.getConfiguration('todolens')
  }
}