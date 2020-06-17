"use strict";
exports.__esModule = true;
var ts = require("typescript");
var decoratorUtil_1 = require("./utils.ts/decoratorUtil");
var MethodGenerator_1 = require("./MethodGenerator");
var ControllerGenerator = /** @class */ (function () {
    function ControllerGenerator(node, current) {
        this.node = node;
        this.current = current;
        this.path = this.getPath();
        this.tags = this.getTags();
        this.isHidden = this.getIsHidden();
    }
    ControllerGenerator.prototype.IsValid = function () {
        return !!this.path || this.path === '';
    };
    ControllerGenerator.prototype.Generate = function () {
        if (!this.node.parent) {
            throw new Error("Controller node doesn't have a valid parent source file.");
        }
        if (!this.node.name) {
            throw new Error("Controller node doesn't have a valid name.");
        }
        var sourceFile = this.node.parent.getSourceFile();
        return {
            location: sourceFile.fileName,
            methods: this.buildMethods(),
            name: this.node.name.text,
            path: this.path || ''
        };
    };
    ControllerGenerator.prototype.buildMethods = function () {
        var _this = this;
        return this.node.members
            .filter(function (m) { return m.kind === ts.SyntaxKind.MethodDeclaration; })
            .map(function (m) { return new MethodGenerator_1.MethodGenerator(m, _this.current, _this.tags, _this.isHidden); })
            .filter(function (generator) { return generator.IsValid(); })
            .map(function (generator) { return generator.Generate(); });
    };
    ControllerGenerator.prototype.getPath = function () {
        var decorators = decoratorUtil_1.getDecorators(this.node, function (identifier) { return identifier.text === 'RouteController'; });
        if (!decorators || !decorators.length) {
            return;
        }
        if (decorators.length > 1) {
            throw new Error("Only one Route decorator allowed in '" + this.node.name.text + "' class.");
        }
        var decorator = decorators[0];
        var expression = decorator.parent;
        var decoratorArgument = expression.arguments[0];
        return decoratorArgument ? "" + decoratorArgument.text : '';
    };
    ControllerGenerator.prototype.getTags = function () {
        var decorators = decoratorUtil_1.getDecorators(this.node, function (identifier) { return identifier.text === 'Tags'; });
        if (!decorators || !decorators.length) {
            return;
        }
        if (decorators.length > 1) {
            throw new Error("Only one Tags decorator allowed in '" + this.node.name.text + "' class.");
        }
        var decorator = decorators[0];
        var expression = decorator.parent;
        return expression.arguments.map(function (a) { return a.text; });
    };
    ControllerGenerator.prototype.getIsHidden = function () {
        var hiddenDecorators = decoratorUtil_1.getDecorators(this.node, function (identifier) { return identifier.text === 'Hidden'; });
        if (!hiddenDecorators || !hiddenDecorators.length) {
            return false;
        }
        if (hiddenDecorators.length > 1) {
            throw new Error("Only one Hidden decorator allowed in '" + this.node.name.text + "' class.");
        }
        return true;
    };
    return ControllerGenerator;
}());
exports.ControllerGenerator = ControllerGenerator;
