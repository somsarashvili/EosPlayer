"use strict";
exports.__esModule = true;
var path = require("path");
var mm = require("minimatch");
var ts = require("typescript");
var ControllerGenerator_1 = require("./ControllerGenerator");
var MetadataGenerator = /** @class */ (function () {
    function MetadataGenerator(entryFile, controllers, ignorePaths) {
        this.ignorePaths = ignorePaths;
        this.nodes = new Array();
        this.program = !!controllers ? this.setProgramToDynamicControllersFiles(controllers) : ts.createProgram([entryFile], {});
        this.typeChecker = this.program.getTypeChecker();
    }
    MetadataGenerator.prototype.Generate = function () {
        this.extractNodeFromProgramSourceFiles();
        return { controllers: this.buildControllers() };
    };
    MetadataGenerator.prototype.buildControllers = function () {
        var _this = this;
        return this.nodes
            .filter(function (node) { return node.kind === ts.SyntaxKind.ClassDeclaration; })
            .map(function (classDeclaration) { return new ControllerGenerator_1.ControllerGenerator(classDeclaration, _this); })
            .filter(function (generator) { return generator.IsValid(); })
            .map(function (generator) { return generator.Generate(); });
    };
    MetadataGenerator.prototype.extractNodeFromProgramSourceFiles = function () {
        var _this = this;
        this.program.getSourceFiles().forEach(function (sf) {
            if (_this.ignorePaths && _this.ignorePaths.length) {
                for (var _i = 0, _a = _this.ignorePaths; _i < _a.length; _i++) {
                    var path_1 = _a[_i];
                    if (mm(sf.fileName, path_1)) {
                        return;
                    }
                }
            }
            ts.forEachChild(sf, function (node) {
                _this.nodes.push(node);
            });
        });
    };
    MetadataGenerator.prototype.setProgramToDynamicControllersFiles = function (controllers) {
        var allGlobFiles = this.importClassesFromDirectories(controllers);
        if (allGlobFiles.length === 0) {
            throw new Error("[" + controllers.join(', ') + "] globs found 0 controllers.");
        }
        return ts.createProgram(allGlobFiles, {});
    };
    MetadataGenerator.prototype.importClassesFromDirectories = function (directories, formats) {
        if (formats === void 0) { formats = ['.ts']; }
        var allFiles = directories.reduce(function (allDirs, dir) {
            return allDirs.concat(require('glob').sync(path.normalize(dir)));
        }, []);
        return allFiles.filter(function (file) {
            var dtsExtension = file.substring(file.length - 5, file.length);
            return formats.indexOf(path.extname(file)) !== -1 && dtsExtension !== '.d.ts';
        });
    };
    return MetadataGenerator;
}());
exports.MetadataGenerator = MetadataGenerator;
