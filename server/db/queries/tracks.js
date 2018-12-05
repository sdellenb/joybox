const knex = require('../connection');

function getTracks(categoryId, albumId) {
    return knex('tracks')
        .select('*')
        .where('album_id', albumId);
}

function getSingleTrack(categoryId, albumId, trackId) {
    return knex('tracks')
        .select('*')
        .where('album_id', albumId)
        .andWhere('id', trackId);
}

module.exports = {
    getTracks,
    getSingleTrack,
};
