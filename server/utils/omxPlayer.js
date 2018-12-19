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
        this.currentlyPlayingPath = null;
    }

    async startPlayback(filepath, startPos) {
        // TODO: Introduce custom exceptions the return the proper status?
        if (jetpack.exists(filepath) !== 'file') {
            return;
        }

        // If we're still on the same file, continue playing.
        if (filepath === omx.getCurrentPath()) {
            await this.pausePlayback();
            return;
        }
        else {
            await this.stopPlayback();
        }

        // Copy the default options, and amend if necessary.
        let playerOptions = Object.assign({}, _defaultOptions);
        if (startPos) {
            playerOptions.startAt = startPos;
        }

        this.currentlyPlayingPath = filepath;
        const playbackFinishedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            const onPlaybackFinished = function() {
                debug('Playback has finished. Resolving promise to play next track.');
                resolve();
            };
            omx.open(filepath, playerOptions, onPlaybackFinished);
        });
        return playbackFinishedPromise;
    }

    async pausePlayback() {
        omx.togglePlay();
    }

    async stopPlayback() {
        omx.stop();
    }
};
