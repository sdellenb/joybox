/* eslint-disable no-console */
const scanFolder = require('recursive-readdir');
const fs = require('fs');
const path = require('path');

// const mediaPath = path.join(__dirname, '..', 'media');
const musicPath = path.join('.', 'media', 'music');
const audiobooksPath = path.join('.', 'media', 'audiobooks');
const extensionsToIgnore = ['*.jpg', '*.jpeg'];

/**
 * Folder structure strictly follows this 3-level pattern:
 *  - audiobooks
 *    - Author - Book Title
 *      - Chapters (single m4b, multiple mp3 etc.)
 *  - music
 *    - Artist - Album
 *      - Songs (multiple mp3 etc.)
*/

scanFolder(musicPath, extensionsToIgnore).then(
    function (files) {
        // console.log('music files are', files);
        const sortedFiles = files.sort();
        let songs = [];
        let id = 0;
        let trackIndex = 0;
        let previousAlbumName = null;
        for (const filePath of sortedFiles) {
            const albumName = filePath.split(path.sep)[2];
            if (albumName === previousAlbumName) {
                trackIndex += 1;
            }
            else {
                trackIndex = 1;
                previousAlbumName = albumName;
            }
            songs.push({'id': ++id, 'track_index': trackIndex, 'path': filePath, 'album_name': albumName});
        }
        fs.writeFileSync('./database/songs.json', JSON.stringify(songs, null, 2));
        console.log('Done.');
    },
    function (error) {
        console.error('something exploded', error);
    }
);


scanFolder(audiobooksPath, extensionsToIgnore).then(
    function (files) {
        // console.log('music files are', files);
        const sortedFiles = files.sort();
        let audiobookChapters = [];
        let id = 0;
        let trackIndex = 0;
        let previousAudiobookName = null;
        for (const filePath of sortedFiles) {
            const audiobookName = filePath.split(path.sep)[2];
            if (audiobookName === previousAudiobookName) {
                trackIndex += 1;
            }
            else {
                trackIndex = 1;
                previousAudiobookName = audiobookName;
            }
            audiobookChapters.push({'id': ++id, 'track_index': trackIndex, 'path': filePath, 'audiobook_name': audiobookName});
        }
        fs.writeFileSync('./database/audiobook_chapters.json', JSON.stringify(audiobookChapters, null, 2));
        console.log('Done.');
    },
    function (error) {
        console.error('something exploded', error);
    }
);
