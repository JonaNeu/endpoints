import { Endpoint } from "./endpointsProvider";
import { HttpMethod } from "./constants";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { EndpointParser } from "./parser";

export class TypescriptEndpointParser implements EndpointParser {
    // todo: we should keep track of the routes declared in other files with
    // todo: we should make the (app|router|route) be dynamic and let the user set it in the
    
    private quotePattern = /("|').*("|')/g;

    //todo: the patterns are not the best yet, but they are hard to get right
    private getPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}get[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private getPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.get/gi

    private postPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}post[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private postPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.post/gi

    private putPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}put[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private putPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.put/gi


    private patchPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}patch[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private patchPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.patch/gi

    private deletePattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}delete[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private deletePattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.delete/gi

    private headPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}head[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private headPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.head/gi

    private connectPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}connect[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private connectPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.connect/gi

    private optionsPattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}options[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private optionsPattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.options/gi

    private tracePattern = /(?<=(?:app|route|router)[\s\S]*?)\.[\s\S]{0,10}trace[\s\S]{0,10}\((?:'|")([\s\S]*?)('|")[,]{1}/gi;
    private tracePattern2 = /\.route[\s\S]*?\([\s\S]*?(?:'|")([\s\S]*?)('|")[\s\S]*?\)[\s\S]*?\.trace/gi

    public getEndpoints(code: string, uri: Uri): Endpoint[] {
        let entries: Endpoint[] = [];
        let prefix: string = '';
        let match: RegExpExecArray | null;
        let position: number = 0;
        
        // GET MAPPINGS
        while ((match = this.getPattern.exec(code)) !== null) {
            position = this.getPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.GET, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.getPattern2.exec(code)) !== null) {
            position = this.getPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.GET, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // POST MAPPINGS
        while ((match = this.postPattern.exec(code)) !== null) {
            position = this.postPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.POST, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.postPattern2.exec(code)) !== null) {
            position = this.postPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.POST, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // PUT MAPPINGS
        while ((match = this.putPattern.exec(code)) !== null) {
            position = this.putPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.PUT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.putPattern2.exec(code)) !== null) {
            position = this.putPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.PUT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // PATCH MAPPINGS
        while ((match = this.patchPattern.exec(code)) !== null) {
            position = this.patchPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.PATCH, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.patchPattern2.exec(code)) !== null) {
            position = this.patchPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.PATCH, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // DELETE MAPPINGS
        while ((match = this.deletePattern.exec(code)) !== null) {
            position = this.deletePattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.DELETE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.deletePattern2.exec(code)) !== null) {
            position = this.patchPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.DELETE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // HEAD MAPPINGS
        while ((match = this.headPattern.exec(code)) !== null) {
            position = this.headPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.HEAD, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.headPattern2.exec(code)) !== null) {
            position = this.headPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.HEAD, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // CONNECT MAPPINGS
        while ((match = this.connectPattern.exec(code)) !== null) {
            position = this.connectPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.CONNECT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.connectPattern2.exec(code)) !== null) {
            position = this.connectPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.CONNECT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // TRACE MAPPINGS
        while ((match = this.tracePattern.exec(code)) !== null) {
            position = this.tracePattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.TRACE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.tracePattern2.exec(code)) !== null) {
            position = this.tracePattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.TRACE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // TRACE MAPPINGS
        while ((match = this.optionsPattern.exec(code)) !== null) {
            position = this.optionsPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.OPTIONS, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        while ((match = this.optionsPattern2.exec(code)) !== null) {
            position = this.optionsPattern2.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.OPTIONS, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        return entries;
    }
}