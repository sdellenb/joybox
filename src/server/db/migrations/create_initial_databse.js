/* eslint-disable no-unused-vars */
exports.up = function(knex, Promise) {
    // Create referenced table before referencing table.
    return knex.schema.createTable('categories', (categories) => {
        categories.increments('id').primary();
        categories.string('name').notNullable().unique();
    }).createTable('albums', (albums) => {
        albums.increments('id').primary();
        albums.string('name').notNullable().unique();
        albums.integer('category_id').references('id').inTable('categories').notNull().onDelete('cascade');
    }).createTable('tracks', (tracks) => {
        tracks.increments('id').primary();
        tracks.integer('track_index').notNullable();
        tracks.string('path', 1024).notNullable().unique();
        tracks.integer('album_id').references('id').inTable('albums').notNull().onDelete('cascade');
    });
};

exports.down = function(knex, Promise) {
    // Reverse order here to prevent error.
    return knex.schema
        .dropTable('tracks')
        .dropTable('albums')
        .dropTable('categories');
};
