/* eslint-disable no-unused-vars */
exports.seed = (knex, Promise) => {
    return knex('categories').del()
        .then(() => {
            return knex('categories').insert({
                category_name: 'audiobooks'
            });
        })
        .then(() => {
            return knex('categories').insert({
                category_name: 'music'
            });
        });
};
