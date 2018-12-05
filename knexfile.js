const path = require('path');

const BASE_PATH = path.join(__dirname, 'src', 'server', 'db');

module.exports = {
    test: {
        client: 'sqlite3',
        connection: './database/library_test.sqlite',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        useNullAsDefault: true,
    },
    development: {
        client: 'sqlite3',
        connection: './database/library_dev.sqlite',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        useNullAsDefault: true,
        asyncStackTraces: true,
    },
    production: {
        client: 'sqlite3',
        connection: './database/library.sqlite',
        migrations: {
            directory: path.join(BASE_PATH, 'migrations'),
        },
        seeds: {
            directory: path.join(BASE_PATH, 'seeds'),
        },
        useNullAsDefault: true,
    },
};
