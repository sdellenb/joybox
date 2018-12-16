const Router = require('koa-router');
const { error } = require('../utils/logger');
const queries = require('../db/queries/categories');

const router = new Router();
const BASE_URL = '/api/v1/categories';

router.get(BASE_URL, async (ctx) => {
    try {
        const categories = await queries.getCategories();
        const categoriesWithThumbnails = addThumbnails(categories);
        ctx.body = {
            status: 'success',
            data: categoriesWithThumbnails,
        };
    } catch (err) {
        error(err);
    }
});
  
router.get(`${BASE_URL}/:categoryId`, async (ctx) => {
    try {
        const {categoryId} = ctx.params;
        const category = await queries.getSingleCategory(categoryId);
        const categoryWithThumbnail = addThumbnails(category);
        if (categoryWithThumbnail.length) {
            ctx.body = {
                status: 'success',
                data: categoryWithThumbnail,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That category does not exist.',
            };
        }
    } catch (err) {
        error(err);
    }
});

function addThumbnails(categories) {
    return categories.map(category => {
        switch (category.name) {
            case 'audiobooks':
                category.thumbnail = '/svg/audiobooks.svg';
                break;
            case 'music':
                category.thumbnail = '/svg/music.svg';
                break;
            default:
                category.thumbnail = '/svg/unknown.svg';
        }
        return category;
    });
}

module.exports = router;

