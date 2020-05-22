import { Endpoint } from "./endpointsProvider";
import { HttpMethod } from "./constants";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { EndpointParser } from "./parser";

export class PhpEndpointParser implements EndpointParser {
    private getPattern = /\:\:get\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private postPattern = /\:\:post\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private putPattern = /\:\:put\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private patchPattern = /\:\:patch\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private deletePattern = /\:\:delete\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private headPattern = /\:\:head\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private connectPattern = /\:\:connect\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private optionsPattern = /\:\:options\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;
    private tracePattern = /\:\:rtrace\((?:"|')([\s\S]*?)(?:"|')[\s\S]*?\)/gi;

    public getEndpoints(code: string, uri: Uri): Endpoint[] {
        let entries: Endpoint[] = [];
        let match: RegExpExecArray | null;
        let position: number = 0;

        // GET MAPPINGS
        while ((match = this.getPattern.exec(code)) !== null) {
            position = this.getPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.GET, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // POST MAPPINGS
        while ((match = this.postPattern.exec(code)) !== null) {
            position = this.postPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.POST, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // PUT MAPPINGS
        while ((match = this.putPattern.exec(code)) !== null) {
            position = this.putPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.PUT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // PATCH MAPPINGS
        while ((match = this.patchPattern.exec(code)) !== null) {
            position = this.patchPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.PATCH, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // DELETE MAPPINGS
        while ((match = this.deletePattern.exec(code)) !== null) {
            position = this.deletePattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.DELETE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // HEAD MAPPINGS
        while ((match = this.headPattern.exec(code)) !== null) {
            position = this.headPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.HEAD, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // CONNECT MAPPINGS
        while ((match = this.connectPattern.exec(code)) !== null) {
            position = this.connectPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.CONNECT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

         // OPTIONS MAPPINGS
         while ((match = this.optionsPattern.exec(code)) !== null) {
            position = this.optionsPattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.OPTIONS, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

         // TRACE MAPPINGS
         while ((match = this.tracePattern.exec(code)) !== null) {
            position = this.tracePattern.lastIndex;
            entries.push(new Endpoint(match[1], HttpMethod.TRACE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        return entries;
    }

}