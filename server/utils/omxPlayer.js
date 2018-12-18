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

        // TODO: How to handle a playback request of what is already playing?
        if (filepath === this.currentlyPlayingPath) {
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
        omx.open(filepath, playerOptions);

        omx.onProgress(function(track){ //subscribe for track updates (every second while not paused for now)
            debug(track.position);
            debug(track.duration);
        });
    }

    async pausePlayback() {
        omx.togglePlay();
    }

    async stopPlayback() {
        omx.stop();
    }
};
