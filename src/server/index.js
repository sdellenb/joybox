const config = require('./config.js');
const server = require('koa-autowire');
 
const app = server.autowire(config);
server.start(app);

console.log( `Ready to accept connections on port ${config.server.httpPort}`); // eslint-disable-line no-console

process.on('SIGINT', function() {
    console.log( '\nGracefully shutting down from SIGINT (Ctrl-C)' ); // eslint-disable-line no-console
    // some other closing procedures go here
    server.stop(app);
});

module.exports = server;
