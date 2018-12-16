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
        execFile(_playerBinary, _playerDefaultOptions)
            .then(result => {
                debug('FakePlayer finished with stdout:');
                debug(result.stdout);
                if (result.stderr) {
                    debug('FakePlayer finished with stderr:');
                    debug(result.stderr);
                }
            })
            .catch(reason => {
                error(`FakePlayer failed with: ${reason}`);
            });
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
