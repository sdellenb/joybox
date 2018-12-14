const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const BasePlayer = require('./basePlayer');

const _playerBinary = '/bin/omxplayer';
const _playerDefaultOptions = ['-o alsa'];
const _playerSeekOption = '--pos ';

module.exports = class OmxPlayer extends BasePlayer {

    constructor() {
        super();
        this.currentlyPlayingPath = null;
    }

    async startPlayback(filepath, startPos = null) {
        // TODO: Assert that the file exists.
        const playerOptions = _playerDefaultOptions;
        if (startPos) {
            playerOptions.push(`${_playerSeekOption} ${startPos}`);
        }
        this.currentlyPlayingPath = filepath;
        const { error, stdout, stderr } = await execFile(_playerBinary, [...playerOptions, filepath]);
        if (error) {
            console.log(`OmxPlayer finished with stderr: ${stderr}`);
            console.log(error);
        }
        else {
            console.log(`OmxPlayer finished with stdout: ${stdout}`);
        }
    }

    async stopPlayback() {
        // TODO: OMX Interaction via DBUS, see
        // https://github.com/popcornmix/omxplayer/blob/master/dbuscontrol.sh
    }
};
