const knex = require('../connection');

function getTracks(categoryId, albumId) {
    return knex('tracks')
        .select('*')
        .where('album_id', albumId);
}

module.exports = {
    getTracks
};
