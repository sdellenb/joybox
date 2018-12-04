/* eslint-disable no-console */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const scanFolder = require('recursive-readdir');
const uuidv4 = require('uuid/v4');

/**
 * Folder structure strictly follows this 3-level pattern:
 *  - audiobooks
 *    - Author - Book Title
 *      - Chapters (single m4b, multiple mp3 etc.)
 *  - music
 *    - Artist - Album
 *      - Songs (multiple mp3 etc.)
*/

function scanToLibrary(category) {
    // const mediaPath = path.join(__dirname, '..', 'media');
    // const musicPath = path.join('.', 'media', 'music');
    // const audiobooksPath = path.join('.', 'media', 'audiobooks');
    const extensionsToIgnore = ['*.jpg', '*.jpeg'];
    const libraryPath = path.join('.', 'media', category);
    assert.ok(fs.existsSync(libraryPath));
    scanFolder(libraryPath, extensionsToIgnore).then(
        function (files) {
            const sortedFiles = files.sort();
            let categoryLibrary = [];
            let trackIndex = null;
            let currentAlbumName = null;
            let currentAlbum = null;
            for (const filePath of sortedFiles) {
                const albumName = filePath.split(path.sep)[2];
                if (albumName !== currentAlbumName) {
                    // New album, re-start track counting.
                    trackIndex = 1;
                    currentAlbum = {
                        uid: uuidv4(),
                        album_name: albumName,
                        tracks: [],
                    };
                    categoryLibrary.push(currentAlbum);
                    currentAlbumName = albumName; // To find out when a new album starts.
                }
                else {
                    trackIndex += 1;
                }
                const track = ({'uid': uuidv4(), 'track_index': trackIndex, 'path': filePath});
                currentAlbum.tracks.push(track);
            }
            fs.writeFileSync(`./database/${category}.json`, JSON.stringify(categoryLibrary, null, 2));
            console.log(`Done writing ./database/${category}.json.`);
        },
        function (error) {
            console.error('something exploded', error);
        }
    );
}

scanToLibrary('music');
scanToLibrary('audiobooks');
