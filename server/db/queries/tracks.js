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

function getFirstTrack(categoryId, albumId) {
    return knex('tracks')
        .select('*')
        .where('album_id', albumId)
        .limit(1)
        .orderBy('track_index', 'asc');
}

module.exports = {
    getTracks,
    getSingleTrack,
    getFirstTrack,
};
