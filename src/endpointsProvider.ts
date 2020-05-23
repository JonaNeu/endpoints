import * as vscode from 'vscode';
import { HttpMethod, ProgrammingLanguage } from './constants';
import { JavaEndpointParser } from './javaParser';
import { TypescriptEndpointParser } from './typescriptParser';
import { PythonEndpointParser } from './pythonParser';
import { PhpEndpointParser } from './phpParser';
import path = require('path');

export class EndpointsProvider implements vscode.TreeDataProvider<Endpoint> {

	private _onDidChangeTreeData: vscode.EventEmitter<Endpoint | undefined> = new vscode.EventEmitter<Endpoint | undefined>();
	readonly onDidChangeTreeData: vscode.Event<Endpoint | undefined> = this._onDidChangeTreeData.event;

	private javaParser: JavaEndpointParser;
	private typescriptParser: TypescriptEndpointParser;
	private pythonParser: PythonEndpointParser;
	private phpParser: PhpEndpointParser;
	
	private endpoints: Endpoint[];

	constructor(private rootFolder: string | undefined) {
		this.javaParser = new JavaEndpointParser();
		this.typescriptParser = new TypescriptEndpointParser();
		this.pythonParser = new PythonEndpointParser();
		this.phpParser = new PhpEndpointParser();
		this.endpoints = [];

		this.getAllEndpoints();
	}

	/**
	 * Search through all files and retrieve endpoints
	 */
	private async getAllEndpoints(): Promise<void> {
		this.endpoints = [];

		// get the glob patterns or take the default
		let includePattern = vscode.workspace.getConfiguration().get('endpoints.files.include');
		includePattern = includePattern ? includePattern : '**/*.{java,php,ts,js,py}';
		
		let excludePattern = vscode.workspace.getConfiguration().get('endpoints.files.exclude');
		excludePattern = excludePattern ? excludePattern : '**/{test,node_modules}/{,**/}*.{java,php,ts,js,py}';

		// get all files, but disregard test and node_modules directories
		vscode.workspace.findFiles(<vscode.GlobPattern>includePattern, <vscode.GlobPattern>excludePattern).then((uris) => {
			uris.forEach((uri) => {
				vscode.workspace.openTextDocument(uri).then((doc) => {
					switch(doc.languageId) { 
						case ProgrammingLanguage.java: { 
							this.endpoints = this.endpoints.concat(this.javaParser.getEndpoints(doc.getText(), uri));
						   	break; 
						}
						case ProgrammingLanguage.javascript:
						case ProgrammingLanguage.typescript: { 
							this.endpoints = this.endpoints.concat(this.typescriptParser.getEndpoints(doc.getText(), uri));
						   	break; 
						}
						case ProgrammingLanguage.python: { 
							this.endpoints = this.endpoints.concat(this.pythonParser.getEndpoints(doc.getText(), uri));
						   	break; 
						}
						case ProgrammingLanguage.php: { 
							this.endpoints = this.endpoints.concat(this.phpParser.getEndpoints(doc.getText(), uri));
						   	break; 
						}
					}

					// update view after each file
					this.reload();
				  });
				
			});
		});
	}

	public getTreeItem(element: Endpoint): vscode.TreeItem {
		return element;
	}

	public getChildren(element?: Endpoint): Thenable<Endpoint[]> {
		
		if (!this.rootFolder) {
			vscode.window.showInformationMessage('Could not find any endpoints in current workspace');
			return Promise.resolve([]);
		}

		if (!element) {
			return Promise.resolve(this.endpoints.sort((a, b) => a.label.localeCompare(b.label)));
		} else {
			// return null objec,t as we don't support nesting yet
			vscode.window.showInformationMessage('Could not find any endpoints in current workspace');
			return Promise.resolve([]);
		}
	}

	/**
	 * Refresh the endpoints and update the view
	 */
	public refresh(): void {
		this.getAllEndpoints();
		this.reload();
	}

	/**
	 * Update the view
	 */
	private reload(): void {
		this._onDidChangeTreeData.fire(undefined);
	} 
}

export class Endpoint extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		public readonly httpMethod: HttpMethod,
		public readonly uri: vscode.Uri,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public readonly documentPosition: number,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	get tooltip(): string {
		return `${this.httpMethod}: ${this.label}`;
	}

	get description(): string {
		return this.httpMethod;
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'icon_black.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'icon_white.svg')
	};

	contextValue = 'endpoint';

}