"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
function activate(context) {
    console.log('Congratulations, your extension "endpoints" is now active!');
    // THINKING
    // to start right away -> activation events -> onLanguage || run when the onView event for the custom view is emmitted
    // get all text documents workspace.textDocuments
    // view Containers and views for the icon in the sidebar -> https://github.com/microsoft/vscode-extension-samples   	
    let activeEditor = vscode.window.activeTextEditor;
    let text = activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.document.getText();
    let language = activeEditor === null || activeEditor === void 0 ? void 0 : activeEditor.document.languageId;
    let disposable = vscode.commands.registerCommand('endpoints.helloWorld', () => {
        vscode.window.showInformationMessage('Hello World from endpoints!');
    });
    context.subscriptions.push(disposable);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map