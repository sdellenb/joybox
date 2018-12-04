const config = require('./config.js');
const server = require('koa-autowire');
 
const app = server.autowire(config);
server.start(app);
