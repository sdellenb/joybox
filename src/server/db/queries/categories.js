const knex = require('../connection');

function getCategories() {
    return knex('categories')
        .select('*');
}

module.exports = {
    getCategories
};
