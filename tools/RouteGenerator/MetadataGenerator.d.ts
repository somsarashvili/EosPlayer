import * as ts from 'typescript';
import { GenIPC } from './models/GenIPC';
export declare class MetadataGenerator {
    private readonly ignorePaths?;
    readonly nodes: ts.Node[];
    readonly typeChecker: ts.TypeChecker;
    private readonly program;
    constructor(entryFile: string, controllers?: string[], ignorePaths?: string[]);
    Generate(): GenIPC.Metadata;
    private buildControllers;
    private extractNodeFromProgramSourceFiles;
    private setProgramToDynamicControllersFiles;
    private importClassesFromDirectories;
}
