const util = require('util');
const execFile = util.promisify(require('child_process').execFile);
const { debug, error } = require('./logger');
const BasePlayer = require('./basePlayer');

const _playerBinary = '/usr/bin/omxplayer';
const _playerDefaultOptions = ['-o alsa --no-osd --no-keys'];
const _playerSeekOption = '--pos ';
const _dbusControlScript = 'scripts/dbuscontrol.sh';

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
        const quotedFilePath = `"${filepath}"`; // Instead of escaping everything that must be, just use quotes.
        execFile(_playerBinary, [...playerOptions, quotedFilePath], {shell: true}) // Must be run in a shell.
            .then(result => {
                debug('OmxPlayer finished with stdout:');
                debug(result.stdout);
                if (result.stderr) {
                    debug('OmxPlayer finished with stderr:');
                    debug(result.stderr);
                }
            })
            .catch(reason => {
                error(`OmxPlayer failed with: ${reason}`);
            });
    }

    async pausePlayback() {
        // TODO: Use dbus-native instead of the script.
        // --dest=org.mpris.MediaPlayer2.omxplayer /org/mpris/MediaPlayer2 org.freedesktop.DBus.Properties.Get string:"org.mpris.MediaPlayer2.Player" string:"PlaybackStatus"
        execFile(_dbusControlScript, ['pause'], {shell: true})
            .then(result => {
                debug('OmxPlayer "pause" command finished with stdout:');
                debug(result.stdout);
                if (result.stderr) {
                    debug('OmxPlayer "pause" command finished with stderr:');
                    debug(result.stderr);
                }
            })
            .catch(reason => {
                error(`OmxPlayer "pause" command failed with: ${reason}`);
            });
    }

    async stopPlayback() {
        // TODO: OMX Interaction via DBUS, see
        // https://github.com/popcornmix/omxplayer/blob/master/dbuscontrol.sh
    }
};
