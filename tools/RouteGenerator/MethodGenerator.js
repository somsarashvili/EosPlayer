"use strict";
exports.__esModule = true;
var decoratorUtil_1 = require("./utils.ts/decoratorUtil");
var MethodGenerator = /** @class */ (function () {
    function MethodGenerator(node, current, parentTags, isParentHidden) {
        this.node = node;
        this.current = current;
        this.parentTags = parentTags;
        this.isParentHidden = isParentHidden;
        this.processMethodDecorators();
    }
    MethodGenerator.prototype.IsValid = function () {
        return !!this.method;
    };
    MethodGenerator.prototype.Generate = function () {
        if (!this.IsValid()) {
            throw new Error("This isn't a valid a controller method.");
        }
        var nodeType = this.node.type;
        if (!nodeType) {
            var typeChecker = this.current.typeChecker;
            var signature = typeChecker.getSignatureFromDeclaration(this.node);
            var implicitType = typeChecker.getReturnTypeOfSignature(signature);
            nodeType = typeChecker.typeToTypeNode(implicitType);
        }
        return {
            name: this.node.name.text,
            path: this.path
        };
    };
    MethodGenerator.prototype.getCurrentLocation = function () {
        var methodId = this.node.name;
        var controllerId = this.node.parent.name;
        return controllerId.text + "." + methodId.text;
    };
    MethodGenerator.prototype.processMethodDecorators = function () {
        var pathDecorators = decoratorUtil_1.getDecorators(this.node, function (identifier) {
            return identifier.text === 'RouteEndpoint';
        });
        if (!pathDecorators || !pathDecorators.length) {
            return;
        }
        if (pathDecorators.length > 1) {
            throw new Error("Only one path decorator in '" + this.getCurrentLocation + "' method, Found: " + pathDecorators.map(function (d) { return d.text; }).join(', '));
        }
        var decorator = pathDecorators[0];
        var expression = decorator.parent;
        var decoratorArgument = expression.arguments[0];
        this.method = decorator.text.toLowerCase();
        // if you don't pass in a path to the method decorator, we'll just use the base route
        // todo: what if someone has multiple no argument methods of the same type in a single controller?
        // we need to throw an error there
        this.path = decoratorArgument ? "" + decoratorArgument.text : '';
    };
    return MethodGenerator;
}());
exports.MethodGenerator = MethodGenerator;
