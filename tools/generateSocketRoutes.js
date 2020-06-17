const { RouteGenerator } = require('./RouteGenerator/RouteGenerator');
new RouteGenerator(
    __dirname + '/../src/main.ts',
    __dirname + '/../src/socket-io/router.ts',
    __dirname + '/RouteGenerator/socketTemplate.hbs',
    ['src/core/controllers/*.controller.ts']
).Generate();