import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "endpoints" is now active!');

	// THINKING
	// to start right away -> activation events -> onLanguage || run when the onView event for the custom view is emmitted
	// get all text documents workspace.textDocuments
	// view Containers and views for the icon in the sidebar -> https://github.com/microsoft/vscode-extension-samples   	




	let activeEditor = vscode.window.activeTextEditor;
	let text = activeEditor?.document.getText();
	let language = activeEditor?.document.languageId;




	let disposable = vscode.commands.registerCommand('endpoints.helloWorld', () => {
		vscode.window.showInformationMessage('Hello World from endpoints!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
