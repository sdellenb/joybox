const knex = require('../connection');

function getAlbums(categoryId) {
    return knex('albums')
        .select('*')
        .where('category_id', categoryId);
}

function getSingleAlbum(categoryId, albumId) {
    return knex('albums')
        .select('*')
        .where('category_id', categoryId)
        .andWhere('id', albumId);
}

module.exports = {
    getAlbums,
    getSingleAlbum,
};
