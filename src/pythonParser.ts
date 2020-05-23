import { Endpoint } from "./endpointsProvider";
import { HttpMethod } from "./constants";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { EndpointParser } from "./parser";

export class PythonEndpointParser implements EndpointParser {

    // we search for patterns like @something.route()
    private routePattern = /\@[\s\S]*?\.route[\s\S]*?\([\s\S]*?(?:"|')([\s\S]*?)(?:"|')([\s\S]*?)\)/gi;

    public getEndpoints(code: string, uri: Uri): Endpoint[] {
        let entries: Endpoint[] = [];
        let match: RegExpExecArray | null;
        let position: number = 0;
        
        // RETRIEVE MAPPINGS
        while ((match = this.routePattern.exec(code)) !== null) {
            position = this.routePattern.lastIndex;

            let path = match[1];
            let methods = this.extractHttpMethods(match[2]);

            methods.forEach((method) => {
                entries.push(new Endpoint(path, method, uri, 
                TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
            });
        }

        return entries;
    }

    /**
     * extract all the methods from the found endpoint string
     */
    private extractHttpMethods(match: string): HttpMethod[] {

        let result: HttpMethod[] = [];

        if (match.toLowerCase().includes("post")) {
            result.push(HttpMethod.POST);
        }

        if (match.toLowerCase().includes("get")) {
            result.push(HttpMethod.GET);
        }

        if (match.toLowerCase().includes("put")) {
            result.push(HttpMethod.PUT);
        }

        if (match.toLowerCase().includes("patch")) {
            result.push(HttpMethod.PATCH);
        }

        if (match.toLowerCase().includes("delete")) {
            result.push(HttpMethod.DELETE);
        }

        if (match.toLowerCase().includes("head")) {
            result.push(HttpMethod.HEAD);
        }

        if (match.toLowerCase().includes("connect")) {
            result.push(HttpMethod.CONNECT);
        }

        if (match.toLowerCase().includes("options")) {
            result.push(HttpMethod.OPTIONS);
        }

        if (match.toLowerCase().includes("trace")) {
            result.push(HttpMethod.TRACE);
        }

        // add get as default
        if (result.length === 0) {
            result.push(HttpMethod.GET)
        }

        return result;
    }

}