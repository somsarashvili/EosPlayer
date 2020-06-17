import * as ts from 'typescript';
import { MetadataGenerator } from "./MetadataGenerator";
import { GenIPC } from './models/GenIPC';
export declare class ControllerGenerator {
    private readonly node;
    private readonly current;
    private readonly path?;
    private readonly tags?;
    private readonly isHidden?;
    constructor(node: ts.ClassDeclaration, current: MetadataGenerator);
    IsValid(): boolean;
    Generate(): GenIPC.Controller;
    private buildMethods;
    private getPath;
    private getTags;
    private getIsHidden;
}
