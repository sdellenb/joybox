/* eslint-disable no-unused-vars */
const categories = require('./api/categories.js');
const albums = require('./api/albums.js');
const tracks = require('./api/tracks.js');

const server = {
    httpPort: process.env.PORT || 3000, // on this port koa will accept http
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
    getCategories: {
        method: 'get', // route endpoint method --> post, get, put, delete
        route: '/api/v1/categories', // route path
        middlewares: [categories.getCategories] // middleware functions that will be used
    },
    getAlbums: {
        method: 'get', // route endpoint method --> post, get, put, delete
        route: '/api/v1/categories/:categoryId/albums', // route path
        middlewares: [albums.getAlbums] // middleware functions that will be used
    },
    getTracks: {
        method: 'get', // route endpoint method --> post, get, put, delete
        route: '/api/v1/categories/:categoryId/albums/:albumId/tracks', // route path
        middlewares: [tracks.getTracks] // middleware functions that will be used
    }
};
module.exports.endpoints = endpoints;
