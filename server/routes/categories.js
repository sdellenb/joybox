const Router = require('koa-router');
const queries = require('../db/queries/categories');

const router = new Router();
const BASE_URL = '/api/v1/categories';

router.get(BASE_URL, async (ctx) => {
    try {
        const categories = await queries.getCategories();
        ctx.body = {
            status: 'success',
            data: categories,
        };
    } catch (err) {
        console.log(err);
    }
});
  
router.get(`${BASE_URL}/:categoryId`, async (ctx) => {
    try {
        const {categoryId} = ctx.params;
        const album = await queries.getSingleCategory(categoryId);
        if (album.length) {
            ctx.body = {
                status: 'success',
                data: album,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That category does not exist.',
            };
        }
    } catch (err) {
        console.log(err);
    }
});
  
module.exports = router;
