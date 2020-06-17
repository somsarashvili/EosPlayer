export declare class RouteGenerator {
    private entryFile;
    private routeFile;
    private templateFile;
    private controllers?;
    private readonly ignorePaths?;
    private routePath;
    constructor(entryFile: string, routeFile: string, templateFile: string, controllers?: string[], ignorePaths?: string[]);
    Generate(): void;
}
