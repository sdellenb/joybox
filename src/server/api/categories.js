const queries = require('../db/queries/categories.js');

module.exports.getCategories = async (ctx) => {
    try {
        const categories = await queries.getCategories();
        ctx.body = {
            status: 'success',
            data: categories
        };
    } catch (err) {
        console.log(err); // eslint-disable-line no-console
    }
};
