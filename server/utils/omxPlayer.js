const omx = require('omx-interface');
const jetpack = require('fs-jetpack');
const { debug } = require('./logger');
const BasePlayer = require('./basePlayer');

const _defaultOptions = {
    audioOutput: 'alsa', 
    blackBackground: false, // Otherwise, the UI won't show.
    disableKeys: true, 
    disableOnScreenDisplay: true,
};

module.exports = class OmxPlayer extends BasePlayer {

    constructor() {
        super();
    }

    async startPlayback(track, options) {
        const filepath = track.path;
        // TODO: Introduce custom exceptions the return the proper status?
        if (jetpack.exists(filepath) !== 'file') {
            return;
        }

        // If we're still on the same file, continue playing.
        if (filepath === omx.getCurrentPath()) {
            return this.pausePlayback(track);
        }
        else {
            await this.stopPlayback(track);
        }

        // Copy the default options, and amend if necessary.
        let playerOptions = Object.assign({}, _defaultOptions);
        if (options && options.startPos) {
            playerOptions.startAt = options.startPos;
        }

        const playbackFinishedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            const onPlaybackFinished = function() {
                debug('Playback has finished. Resolving promise to play next track.');
                resolve(track);
            };
            omx.open(filepath, playerOptions, onPlaybackFinished);
        });
        return playbackFinishedPromise;
    }

    async pausePlayback(track) {
        const playbackPausedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            omx.togglePlay();
            resolve(track);
        });
        return playbackPausedPromise;
    }

    async stopPlayback(track) {
        const playbackStoppedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            omx.stop();
            resolve(track);
        });
        return playbackStoppedPromise;
    }
};
