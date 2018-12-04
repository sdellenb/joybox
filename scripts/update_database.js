/* eslint-disable no-console */
const recursive = require('recursive-readdir');
const path = require('path');

// const mediaPath = path.join(__dirname, '..', 'media');
const musicPath = path.join('.', 'media', 'music');
const audiobooksPath = path.join('.', 'media', 'audiobooks');

/**
 * Folder structure strictly follows this 3-level pattern:
 *  - audiobooks
 *    - Author - Book Title
 *      - Chapters (single m4b, multiple mp3 etc.)
 *  - music
 *    - Artist - Album
 *      - Songs (multiple mp3 etc.)
*/

// For testing, we only have music.
recursive(musicPath/* , ['*.mp3'] */).then(
    function (files) {
        console.log('music files are', files);
    },
    function (error) {
        console.error('something exploded', error);
    }
);

recursive(audiobooksPath/* , ['*.mp3'] */).then(
    function (files) {
        console.log('files are', files);
    },
    function (error) {
        console.error('something exploded', error);
    }
);
