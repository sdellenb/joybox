const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { debug, error } = require('./logger');
const BasePlayer = require('./basePlayer');

const _playerBinary = 'sleep';
const _playerDefaultOptions = ['3'];

module.exports = class FakePlayer extends BasePlayer {

    constructor() {
        super();
        this.currentlyPlayingPath = null;
        this.isPaused = false;
    }

    async startPlayback(track) {
        const filepath = track.path;
        if (filepath === this.currentlyPlayingPath) {
            if (this.isPaused) {
                return this.pausePlayback(track);
            }
            return;
        }
        this.currentlyPlayingPath = filepath;

        const playbackFinishedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            execFile(_playerBinary, _playerDefaultOptions)
                .then(() => {
                    debug('Playback has finished. Resolving promise to play next track.');
                    resolve(track);
                })
                .catch(reason => {
                    error(`FakePlayer failed with: ${reason}`);
                });
        });
        return playbackFinishedPromise;
    }

    async pausePlayback(track) {
        const playbackPausedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            // Nothing to do here. Sleep cannot be interrupted.
            this.isPaused = !this.isPaused;
            debug('FakePlayer is pausing playback.');
            resolve(track);
        });
        return playbackPausedPromise;
    }

    async stopPlayback(track) {
        const playbackStoppedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            // Nothing to do here. Sleep cannot be interrupted.
            debug('FakePlayer is stopping playback.');
            resolve(track);
        });
        return playbackStoppedPromise;
    }

};
