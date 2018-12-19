const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { debug, error } = require('./logger');
const BasePlayer = require('./basePlayer');

const _playerBinary = 'sleep';
const _playerDefaultOptions = ['3'];
const _playerSeekOption = ''; // eslint-disable-line no-unused-vars

module.exports = class FakePlayer extends BasePlayer {

    constructor() {
        super();
    }

    // eslint-disable-next-line no-unused-vars
    async startPlayback(filepath, startPos = null) {
        const playbackFinishedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            execFile(_playerBinary, _playerDefaultOptions)
                .then(() => {
                    debug('Playback has finished. Resolving promise to play next track.');
                    resolve();
                })
                .catch(reason => {
                    error(`FakePlayer failed with: ${reason}`);
                });
        });
        return playbackFinishedPromise;
    }

    async pausePlayback() {
        // Nothing to do here. Sleep cannot be interrupted.
        debug('FakePlayer is pausing playback.');
    }

    async stopPlayback() {
        // Nothing to do here. Sleep cannot be interrupted.
        debug('FakePlayer is stopping playback.');
    }
};
