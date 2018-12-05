const queries = require('../db/queries/tracks.js');

module.exports.getTracks = async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        const tracks = await queries.getTracks(categoryId, albumId);
        ctx.body = {
            status: 'success',
            data: tracks
        };
    } catch (err) {
        console.log(err); // eslint-disable-line no-console
    }
};
