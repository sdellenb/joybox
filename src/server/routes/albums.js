const Router = require('koa-router');
const queries = require('../db/queries/albums');

const router = new Router();
const BASE_URL = '/api/v1/albums';

router.get(BASE_URL, async (ctx) => {
    try {
        const albums = await queries.getAllAlbums();
        ctx.body = {
            status: 'success',
            data: albums
        };
    } catch (err) {
        console.log(err); // eslint-disable-line no-console
    }
});

module.exports = router;
