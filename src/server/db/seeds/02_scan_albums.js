/* eslint-disable no-unused-vars, no-console */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const scanFolder = require('recursive-readdir');

// Scans the categories in the media folder for albums.
exports.seed = async (knex, Promise) => {
    // The categories were populated by the 01_categories.js seed.
    const categories = await knex.select('id', 'name').from('categories');

    // First, wipe the existing album table data.
    await knex('albums').del();
    for(const {id, name} of categories) {
        console.log(`\nScanning category ${name}...`);
        const scanResult = await scanCategory(id, name);
        // console.log(`scanResult: ${JSON.stringify(scanResult, null, 2)}`);
        await knex.into('albums').insert(scanResult);
    }
    console.log('Done.\n');
};

async function scanCategory(id, name) {
    // TODO: Move these to global config.
    const mediaFolder = 'media';
    const extensionsToIgnore = ['*.jpg', '*.jpeg'];
    const libraryPath = path.join('.', mediaFolder, name);
    assert.ok(fs.existsSync(libraryPath));
    const files = await scanFolder(libraryPath, extensionsToIgnore);
    const sortedFiles = files.sort();
    let categoryLibrary = [];
    // let trackIndex = null;
    let currentAlbumName = null;
    let currentAlbum = null;
    for (const filePath of sortedFiles) {
        const albumName = filePath.split(path.sep)[2];
        if (albumName !== currentAlbumName) {
            // New album, re-start track counting.
            // trackIndex = 1;
            currentAlbum = {
                name: albumName,
                category_id: id,
            };
            categoryLibrary.push(currentAlbum);
            currentAlbumName = albumName; // To find out when a new album starts.
        }
        // else {
        //     trackIndex += 1;
        // }
        // const track = ({'uid': uuidv4(), 'track_index': trackIndex, 'path': filePath});
        // currentAlbum.tracks.push(track);
    }
    return categoryLibrary;
}
