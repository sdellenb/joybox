/* eslint-disable no-unused-vars */
exports.up = function(knex, Promise) {
    return knex.schema.table('albums', function(t) {
        // The thumbnails will be stored with a GUID (generated in the model) under
        // '/static/generated/thumbnails' and have the extension '.jpg'
        t.uuid('thumbnail').unique();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.table('albums', function(t) {
        t.dropColumn('thumbnail');
    });
};
