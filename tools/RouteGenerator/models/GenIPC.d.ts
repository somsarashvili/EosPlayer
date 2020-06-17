export declare namespace GenIPC {
    interface Metadata {
        controllers: Controller[];
    }
    interface Controller {
        location: string;
        methods: Method[];
        name: string;
        path: string;
    }
    interface Method {
        name: string;
        path: string;
    }
    interface Parameter {
        parameterName: string;
        description?: string;
        name: string;
        required?: boolean;
        type: Type;
        default?: any;
    }
    interface Response {
        description: string;
        name: string;
        schema?: Type;
        examples?: any;
    }
    interface Property {
        default?: any;
        description?: string;
        format?: string;
        name: string;
        type: Type;
        required: boolean;
    }
    type TypeStringLiteral = 'string' | 'boolean' | 'double' | 'float' | 'integer' | 'long' | 'enum' | 'array' | 'datetime' | 'date' | 'binary' | 'buffer' | 'byte' | 'void' | 'object' | 'any' | 'refEnum' | 'refObject' | 'nestedObjectLiteral' | 'union' | 'intersection';
    type RefTypeLiteral = 'refObject' | 'refEnum';
    type PrimitiveTypeLiteral = Exclude<TypeStringLiteral, RefTypeLiteral | 'enum' | 'array' | 'void' | 'nestedObjectLiteral' | 'union' | 'intersection'>;
    interface TypeBase {
        dataType: TypeStringLiteral;
    }
    type PrimitiveType = StringType | BooleanType | DoubleType | FloatType | IntegerType | LongType | VoidType;
    /**
     * This is one of the possible objects that tsoa creates that helps the code store information about the type it found in the code.
     */
    type Type = PrimitiveType | ObjectsNoPropsType | EnumType | ArrayType | DateTimeType | DateType | BinaryType | BufferType | ByteType | AnyType | RefEnumType | RefObjectType | NestedObjectLiteralType | UnionType | IntersectionType;
    interface StringType extends TypeBase {
        dataType: 'string';
    }
    interface BooleanType extends TypeBase {
        dataType: 'boolean';
    }
    /**
     * This is the type that occurs when a developer writes `const foo: object = {}` since it can no longer have any properties added to it.
     */
    interface ObjectsNoPropsType extends TypeBase {
        dataType: 'object';
    }
    interface DoubleType extends TypeBase {
        dataType: 'double';
    }
    interface FloatType extends TypeBase {
        dataType: 'float';
    }
    interface IntegerType extends TypeBase {
        dataType: 'integer';
    }
    interface LongType extends TypeBase {
        dataType: 'long';
    }
    /**
     * Not to be confused with `RefEnumType` which is a reusable enum which has a $ref name generated for it. This however, is an inline enum.
     */
    interface EnumType extends TypeBase {
        dataType: 'enum';
        enums: Array<string | number>;
    }
    interface ArrayType extends TypeBase {
        dataType: 'array';
        elementType: Type;
    }
    interface DateType extends TypeBase {
        dataType: 'date';
    }
    interface DateTimeType extends TypeBase {
        dataType: 'datetime';
    }
    interface BinaryType extends TypeBase {
        dataType: 'binary';
    }
    interface BufferType extends TypeBase {
        dataType: 'buffer';
    }
    interface ByteType extends TypeBase {
        dataType: 'byte';
    }
    interface VoidType extends TypeBase {
        dataType: 'void';
    }
    interface AnyType extends TypeBase {
        dataType: 'any';
    }
    interface NestedObjectLiteralType extends TypeBase {
        dataType: 'nestedObjectLiteral';
        properties: Property[];
        additionalProperties?: Type;
    }
    interface RefEnumType extends ReferenceTypeBase {
        dataType: 'refEnum';
        enums: Array<string | number>;
    }
    interface RefObjectType extends ReferenceTypeBase {
        dataType: 'refObject';
        properties: Property[];
        additionalProperties?: Type;
    }
    type ReferenceType = RefEnumType | RefObjectType;
    interface ReferenceTypeBase extends TypeBase {
        description?: string;
        dataType: RefTypeLiteral;
        refName: string;
        example?: any;
    }
    interface UnionType extends TypeBase {
        dataType: 'union';
        types: Type[];
    }
    interface IntersectionType extends TypeBase {
        dataType: 'intersection';
        types: Type[];
    }
    interface ReferenceTypeMap {
        [refName: string]: ReferenceType;
    }
}
