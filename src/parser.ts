import { Endpoint } from "./endpointsProvider";
import { Uri } from "vscode";

export interface EndpointParser {
    getEndpoints(code: string, uri: Uri): Endpoint[];
};
