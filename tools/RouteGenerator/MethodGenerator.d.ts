import * as ts from 'typescript';
import { MetadataGenerator } from './MetadataGenerator';
import { GenIPC } from './models/GenIPC';
export declare class MethodGenerator {
    private readonly node;
    private readonly current;
    private readonly parentTags?;
    private readonly isParentHidden?;
    private method;
    private path;
    constructor(node: ts.MethodDeclaration, current: MetadataGenerator, parentTags?: string[], isParentHidden?: boolean);
    IsValid(): boolean;
    Generate(): GenIPC.Method;
    private getCurrentLocation;
    private processMethodDecorators;
}
