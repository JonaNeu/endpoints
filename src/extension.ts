import * as vscode from 'vscode';
import { EndpointsProvider } from './endpointsProvider';

export function activate(context: vscode.ExtensionContext) {
	// todo: create set for holding the endpoints, to avoid duplicates
	// todo: allow setting the folder via the settings
	// todo: sort button for the tree view

	let rootFolders = vscode.workspace.workspaceFolders;
	let rootFolder = rootFolders === undefined ? undefined : rootFolders[0];

	const endpointsProvider = new EndpointsProvider(rootFolder?.uri.fsPath);
	vscode.window.registerTreeDataProvider('endpoints', endpointsProvider);
	vscode.commands.registerCommand('endpoints.refreshEntry', () => endpointsProvider.refresh());
	
	vscode.commands.registerCommand('endpoints.openFile', (uri, documentPosition) => {
		vscode.workspace.openTextDocument(uri).then((doc) => {	
			vscode.window.showTextDocument(doc, 1, false).then((editor) => {				
				// convert lastIndex from regex into a position
				let newPosition = editor.document.positionAt(documentPosition);

				// set range and selection to position
				let newSelection = new vscode.Selection(newPosition, newPosition);
				let newRange = new vscode.Range(newPosition, newPosition)
				editor.revealRange(newRange, vscode.TextEditorRevealType.InCenter)
				editor.selection = newSelection;
			});
		}); 
	});
}
// this method is called when your extension is deactivated
export function deactivate() {}
