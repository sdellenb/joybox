const queries = require('../db/queries/albums.js');

module.exports.getAlbums = async (ctx) => {
    try {
        const {categoryId} = ctx.params;
        const albums = await queries.getAlbums(categoryId);
        ctx.body = {
            status: 'success',
            data: albums
        };
    } catch (err) {
        console.log(err); // eslint-disable-line no-console
    }
};
