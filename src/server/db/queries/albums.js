const knex = require('../connection');

function getAlbums(categoryId) {
    return knex('albums')
        .select('*')
        .where('category_id', categoryId);
}

module.exports = {
    getAlbums
};
