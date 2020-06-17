const { RouteGenerator } = require('./RouteGenerator/RouteGenerator');
new RouteGenerator(
    __dirname + '/../src/main.ts',
    __dirname + '/../src/electron/router.ts',
    __dirname + '/RouteGenerator/template.hbs',
    ['src/core/controllers/*.controller.ts']
).Generate();