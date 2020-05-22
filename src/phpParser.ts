import { Endpoint } from "./endpointsProvider";
import { HttpMethod } from "./constants";
import { TreeItemCollapsibleState, Uri } from "vscode";
import { EndpointParser } from "./parser";

export class PhpEndpointParser implements EndpointParser {
    
    private quotePattern = /("|').*("|')/g;
    private valuePattern = /value[\s\S]*?\=[\s\S]*?(("|')(([\s\S]*?))("|'))/gi;
    private methodPattern = /method[\s\S]*?\=[\s\S]*?(?:(?:"|')?(?:[\s\S]*?).*((POST|GET|DELETE|PUT|PATCH|HEAD|CONNECT|TRACE|OPTIONS)([\s\S]*?))("|')?)/gi;

    // we want ot make sure that a @RestController or @Controller comes before
    private globalRequestPattern = /(?:@RestController(?:[\s\S]*?)|@Controller(?:[\s\S]*?)){1}@RequestMapping\(([\s\S]*?)\)([\s\S]*?)class{1}/gi;

    private requestPattern = /@RequestMapping\(([\s\S]*?)\)/gi;

    private getPattern = /@GetMapping\(([\s\S]*?)\)/gi;
    private postPattern = /@PostMapping\(([\s\S]*?)\)/gi;
    private putPattern = /@PutMapping\(([\s\S]*?)\)/gi;
    private patchPattern = /@PatchMapping\(([\s\S]*?)\)/gi;
    private deletePattern = /@DeleteMapping\(([\s\S]*?)\)/gi;
    private headPattern = /@HeadMapping\(([\s\S]*?)\)/gi;
    private connectPattern = /@ConnectMapping\(([\s\S]*?)\)/gi;
    private optionsPattern = /@OptionsMapping\(([\s\S]*?)\)/gi;
    private tracePattern = /@TraceMapping\(([\s\S]*?)\)/gi;

    public getEndpoints(code: string, uri: Uri): Endpoint[] {
        let entries: Endpoint[] = [];
        let prefix: string = '';
        let match: RegExpExecArray | null;
        let position: number = 0;

        // we first check if we have a global prefix for this class
        code.match(this.globalRequestPattern)?.forEach((match) => {
            // todo: broken for some use cases e.g. users-endpoint
            prefix = this.extractPath(match);
        });

         // MAPPINGS FOR @RequestMapping
         while ((match = this.requestPattern.exec(code)) !== null) {
            position = this.requestPattern.lastIndex;
            let method = match[1].match(this.methodPattern);

            let extractedPath = this.extractPath(match[1]);
            
            // in case we match the same value as the prefix again, disregard
            if (extractedPath === prefix) {
                continue;
            }

            // if method exists, take it otherwise take GET as default
            if (method) {
                entries.push(new Endpoint(prefix + extractedPath, this.extractHttpMethod(method[0]), uri, 
                TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
            } else {
                entries.push(new Endpoint(prefix + extractedPath, HttpMethod.GET, uri, 
                TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
            }
        }
        
        // GET MAPPINGS
        while ((match = this.getPattern.exec(code)) !== null) {
            position = this.getPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.GET, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // POST MAPPINGS
        while ((match = this.postPattern.exec(code)) !== null) {
            position = this.postPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.POST, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // PUT MAPPINGS
        while ((match = this.putPattern.exec(code)) !== null) {
            position = this.putPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.PUT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // PATCH MAPPINGS
        while ((match = this.patchPattern.exec(code)) !== null) {
            position = this.patchPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.PATCH, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // DELETE MAPPINGS
        while ((match = this.deletePattern.exec(code)) !== null) {
            position = this.deletePattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.DELETE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // HEAD MAPPINGS
        while ((match = this.headPattern.exec(code)) !== null) {
            position = this.headPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.HEAD, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // CONNECT MAPPINGS
        while ((match = this.connectPattern.exec(code)) !== null) {
            position = this.connectPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.CONNECT, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

         // OPTIONS MAPPINGS
         while ((match = this.optionsPattern.exec(code)) !== null) {
            position = this.optionsPattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.OPTIONS, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

         // TRACE MAPPINGS
         while ((match = this.tracePattern.exec(code)) !== null) {
            position = this.tracePattern.lastIndex;
            entries.push(new Endpoint(prefix + this.extractPath(match[1]), HttpMethod.TRACE, uri, 
            TreeItemCollapsibleState.None, position, { command: 'endpoints.openFile', title: '', arguments: [uri, position] }));
        }

        // SAVE
        // code.match(this.putPattern)?.forEach((match) => {
        //     entries.push(new Endpoint(prefix + this.extractPath(match), HttpMethod.PUT, uri, 
        //         TreeItemCollapsibleState.None, 27, { command: 'endpoints.openFile', title: '', arguments: [uri, 27] }));
        // });

        return entries;
    }


    private extractPath(match: string): string {
        let path = '';
        
        if (match.toLowerCase().includes('value')) {
            // if we have multiple paramters we have to get the value parameter
            let temp = match.match(this.valuePattern);
            if (temp) {
                path = temp[0];
            }
        } else {
            // in this case we only have quotes that hold the path
            path = match;
        }

        // extract between quotes
        let maybePath = path.match(this.quotePattern);
        if (maybePath) {
            path = maybePath[0];
        } else {
            // path could not be extracted properly
            return '';
        }

        // remove quotes and return
        return path.substring(1, path.length - 1);
    }


    private extractHttpMethod(match: string): HttpMethod {

        if (match.toLowerCase().includes("post")) {
            return HttpMethod.POST;
        }

        if (match.toLowerCase().includes("get")) {
            return HttpMethod.GET;
        }

        if (match.toLowerCase().includes("put")) {
            return HttpMethod.PUT;
        }

        if (match.toLowerCase().includes("patch")) {
            return HttpMethod.PATCH;
        }

        if (match.toLowerCase().includes("delete")) {
            return HttpMethod.DELETE;
        }

        if (match.toLowerCase().includes("head")) {
            return HttpMethod.HEAD;
        }

        if (match.toLowerCase().includes("connect")) {
            return HttpMethod.CONNECT;
        }

        if (match.toLowerCase().includes("options")) {
            return HttpMethod.OPTIONS;
        }

        if (match.toLowerCase().includes("trace")) {
            return HttpMethod.TRACE;
        }

        // return GET as default
        return HttpMethod.GET;
    }

}