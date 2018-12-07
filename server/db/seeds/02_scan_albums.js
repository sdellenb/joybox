/* eslint-disable no-unused-vars, no-console */
const assert = require('assert');
const jetpack = require('fs-jetpack');
const path = require('path');
const scanFolder = require('recursive-readdir');
const sharp = require('sharp');
const uuidv4 = require('uuid/v4');

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
    const supportedMediaTypes = ['.mp3', '.m4a', '.m4b', '.ogg', '.wav', '.flac']; // omxplayer supports way more...
    const supportedAlbumCoverTypes = ['.jpg', '.jpeg', '.png'];
    const extensionsToIgnore = ['*.m3u', '*.pls', '*.txt'];
    const libraryPath = path.join('.', mediaFolder, name);
    assert.ok(jetpack.exists(libraryPath) === 'dir');
    const thumbnailOutputFolder = path.join('.', 'static', 'generated', 'thumbnails');
    assert.ok(jetpack.exists(thumbnailOutputFolder) === 'dir');

    // TODO: Use jetpack.inspectTree instead?
    const foundFiles = await scanFolder(libraryPath, extensionsToIgnore);
    let categoryAlbums = [];
    let trackIndex = null;
    let currentAlbumName = null;
    let currentAlbum = null;
    for (const filePath of foundFiles) {
        // Index 0 is 'media', index 1 is the category.
        const albumName = filePath.split(path.sep)[2];
        if (albumName !== currentAlbumName) {
            // New album, re-start track counting.
            // The first file in the folder could be a cover image or a track, so 
            // this code is kept general.
            trackIndex = 1;
            currentAlbum = {
                name: albumName,
                category_id: id,
                tracks: [],
                thumbnail: null,
            };
            categoryAlbums.push(currentAlbum);
            currentAlbumName = albumName; // To find out when a new album starts.
        }
        else {
            trackIndex += 1;
        }

        console.log(`=== ${filePath}`);
        if (supportedAlbumCoverTypes.some(suffix => filePath.endsWith(suffix))) {
            trackIndex -= 1; // Do not count images as tracks.
            console.log(`Processing cover image ${filePath}`);
            const thumbnailUuid = await processCoverImage(filePath, thumbnailOutputFolder);
            currentAlbum.thumbnail = thumbnailUuid;
        }
        else {
            const track = ({'track_index': trackIndex, 'path': filePath});
            currentAlbum.tracks.push(track);    
        }
    }
    return categoryAlbums;
}

async function processCoverImage(inputFilePath, thumbnailOutputFolder) {
    let thumbnailUuid = uuidv4();
    while (jetpack.exists(path.join(thumbnailOutputFolder, `${thumbnailUuid}.jpg`)) === 'file') {
        // In case we managed to produce a collision, find another uuid.
        console.warn('UUID collision detected!');
        thumbnailUuid = uuidv4();
    }
    const thumbnailOutputFile = path.join(thumbnailOutputFolder, `${thumbnailUuid}.jpg`);

    const resizeOptions = {
        width: 200,
        height: 200,
        fit: sharp.fit.outside,
        withoutEnlargement: true,
        position: 'right top',
    };

    const data = await sharp(inputFilePath)
        .trim()
        .resize(resizeOptions)
        .toFormat('jpeg')
        .toBuffer();
    await jetpack.writeAsync(thumbnailOutputFile, data);
    return thumbnailUuid;
}
