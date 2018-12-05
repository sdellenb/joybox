const knex = require('../connection');

function getCategories() {
    return knex('categories')
        .select('*');
}

function getSingleCategory(categoryId) {
    return knex('categories')
        .select('*')
        .where('id', categoryId);
}

module.exports = {
    getCategories,
    getSingleCategory,
};
