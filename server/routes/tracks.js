const Router = require('koa-router');
const queries = require('../db/queries/tracks');

const router = new Router();
const BASE_URL = '/api/v1/categories/:categoryId/albums/:albumId/tracks';

router.get(BASE_URL, async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        const tracks = await queries.getTracks(categoryId, albumId);
        ctx.body = {
            status: 'success',
            data: tracks,
        };
    } catch (err) {
        console.log(err);
    }
});
  
router.get(`${BASE_URL}/:trackId`, async (ctx) => {
    try {
        const {categoryId, albumId, trackId} = ctx.params;
        const album = await queries.getSingleTrack(categoryId, albumId, trackId);
        if (album.length) {
            ctx.body = {
                status: 'success',
                data: album,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That track does not exist.',
            };
        }
    } catch (err) {
        console.log(err);
    }
});
  
module.exports = router;
