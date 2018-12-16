const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const BasePlayer = require('./basePlayer');

const _playerBinary = '/usr/bin/omxplayer';
const _playerDefaultOptions = ['-o alsa --no-osd --no-keys'];
const _playerSeekOption = '--pos ';

module.exports = class OmxPlayer extends BasePlayer {

    constructor() {
        super();
        this.currentlyPlayingPath = null;
    }

    async startPlayback(filepath, startPos) {
        if (filepath === this.currentlyPlayingPath) {
            return;
        }
        else {
            await this.stopPlayback();
        }
        let playerOptions = [..._playerDefaultOptions];
        if (startPos) {
            playerOptions.push(`${_playerSeekOption} ${startPos}`);
        }

        // TODO: Assert that the file exists.
        this.currentlyPlayingPath = filepath;
        const escapedFilePath = filepath.replace(/(\s+)/g, '\\$1');
        const promise = execFile(_playerBinary, [...playerOptions, escapedFilePath], {shell: true}); // Must be run in a shell.
        return promise.then(result => {
            console.log('OmxPlayer finished with stdout:');
            console.log(result.stdout);
            if (result.stderr) {
                console.log('OmxPlayer finished with stderr:');
                console.log(result.stderr);
            }
        })
            .catch(reason => {
                console.log(`OmxPlayer failed with: ${reason}`);
            });
    }

    async pausePlayback() {
        // TODO: Use dbus-native instead of the script.
        // --dest=org.mpris.MediaPlayer2.omxplayer /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:"org.mpris.MediaPlayer2.Player" string:"PlaybackStatus"
        execFile(_dbusControlScript, ['pause'])
            .then(result => {
                console.log('OmxPlayer "pause" command finished with stdout:');
                console.log(result.stdout);
                if (result.stderr) {
                    console.log('OmxPlayer "pause" command finished with stderr:');
                    console.log(result.stderr);
                }
            })
            .catch(reason => {
                console.log(`OmxPlayer "pause" command failed with: ${reason}`);
            });

    }

    async stopPlayback() {
        // TODO: OMX Interaction via DBUS, see
        // https://github.com/popcornmix/omxplayer/blob/master/dbuscontrol.sh
    }
};
