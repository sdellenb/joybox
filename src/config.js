/* eslint-disable no-unused-vars */
const server = {
    httpPort: 3000, // on this port koa will accept http
};
module.exports.server = server;

const koa = {
    middlewares: {
        logger: {
            package: 'koa-logger',
            options: [] // constructor options
        },
        static: {
            package: 'koa-static',
            options: ['./src/client'] // constructor options
        }
    }
};
module.exports.koa = koa;

const db = {};
module.exports.db = db;

const endpoints = {
    getIndex: {
        method: 'get',
        route: '/',
        middlewares: ['static']
    },
    getAlbums: {
        method: 'get', // route endpoint method --> post, get, put, delete
        route: 'albums', // route path
        middlewares: [] // middleware functions that will be used
    }
};
module.exports.endpoints = endpoints;
