"use strict";
exports.__esModule = true;
var MetadataGenerator_1 = require("./MetadataGenerator");
var hbs = require("handlebars");
var fs = require("fs");
var path = require("path");
var RouteGenerator = /** @class */ (function () {
    function RouteGenerator(entryFile, routeFile, templateFile, controllers, ignorePaths) {
        this.entryFile = entryFile;
        this.routeFile = routeFile;
        this.templateFile = templateFile;
        this.controllers = controllers;
        this.ignorePaths = ignorePaths;
        var routes = routeFile.split('/');
        routes.pop();
        this.routePath = routes.join('/');
    }
    RouteGenerator.prototype.Generate = function () {
        var _this = this;
        var metadata = new MetadataGenerator_1.MetadataGenerator(this.entryFile, this.controllers, this.ignorePaths).Generate();
        metadata.controllers.forEach(function (file) { return file.location = path.relative(_this.routePath, file.location).replace('.ts', '').replace(/\\/g, '/'); });
        var data = fs.readFileSync(this.templateFile).toString();
        var tpl = hbs.compile(data, { noEscape: true });
        fs.writeFileSync(this.routeFile, tpl(metadata));
    };
    return RouteGenerator;
}());
exports.RouteGenerator = RouteGenerator;
