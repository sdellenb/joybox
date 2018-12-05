/* eslint-disable no-unused-vars, no-console */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const scanFolder = require('recursive-readdir');

// Scans the categories in the media folder for albums.
exports.seed = async (knex, Promise) => {
    // The categories were populated by the 01_categories.js seed.
    const categories = await knex.select('id', 'name').from('categories');

    // First, wipe the existing album and tracks tables.
    await knex('albums').del();
    await knex('tracks').del();
    await knex('SQLITE_SEQUENCE').update('SEQ', 0).where('name', 'albums').orWhere('name', 'tracks'); // Reset the sequences.
    for(const {id, name} of categories) {
        console.log(`\nScanning category ${name}...`);
        const categoryAlbums = await scanCategory(id, name);
 
        for(const albumWithTracks of categoryAlbums) {
            const {tracks, ...album} = albumWithTracks;
            await knex.into('albums').insert(album);
            // Workaround, as insert returns a weird Array-looking Object with the number of rows in the table.
            // See also https://github.com/tgriesser/knex/issues/2917#issuecomment-440263593
            const [row] = await knex.select(knex.raw('last_insert_rowid() as id'));
            const album_id = row.id;
            console.log(`* Album '${album.name}' added with id '${album_id}'.`);

            const tracksWithAlbumId = tracks.map(track => {
                track['album_id'] = album_id;
                return track;
            });
            await knex.into('tracks').insert(tracksWithAlbumId);
            console.log(`** Number of tracks added to album '${album_id}': ${tracks.length}`);
        }
    }
    console.log('\nDone.\n');
};

async function scanCategory(id, name) {
    // TODO: Move these to global config.
    const mediaFolder = 'media';
    const extensionsToIgnore = ['*.jpg', '*.jpeg'];
    const libraryPath = path.join('.', mediaFolder, name);
    assert.ok(fs.existsSync(libraryPath));

    const files = await scanFolder(libraryPath, extensionsToIgnore);
    const sortedFiles = files.sort();
    let categoryAlbums = [];
    let trackIndex = null;
    let currentAlbumName = null;
    let currentAlbum = null;
    for (const filePath of sortedFiles) {
        // Index 0 is 'media', index 1 is the category.
        const albumName = filePath.split(path.sep)[2];
        if (albumName !== currentAlbumName) {
            // New album, re-start track counting.
            trackIndex = 1;
            currentAlbum = {
                name: albumName,
                category_id: id,
                tracks: [],
            };
            categoryAlbums.push(currentAlbum);
            currentAlbumName = albumName; // To find out when a new album starts.
        }
        else {
            trackIndex += 1;
        }
        const track = ({'track_index': trackIndex, 'path': filePath});
        currentAlbum.tracks.push(track);
    }
    return categoryAlbums;
}
