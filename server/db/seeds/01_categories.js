/* eslint-disable no-unused-vars */
exports.seed = async (knex, Promise) => {
    await knex('categories').del();

    // Only two categories and hardcoded for now.
    await knex('categories').insert({ name: 'audiobooks'});
    await knex('categories').insert({ name: 'music' });
};
