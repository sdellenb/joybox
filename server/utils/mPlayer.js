const { AudioPlayer } = require('play-sound-mplayer');
const mplayer = new AudioPlayer();
const jetpack = require('fs-jetpack');
const { debug } = require('./logger');
const BasePlayer = require('./basePlayer');

module.exports = class MPlayer extends BasePlayer {

    constructor() {
        super();
        this.currentlyPlayingTrack = null;
        this.isPaused = false;
    }

    async startPlayback(track) {
        const filepath = track.path;
        // TODO: Introduce custom exceptions the return the proper status?
        if (jetpack.exists(filepath) !== 'file') {
            return;
        }

        // If we're still on the same file, continue playing.
        if (this.currentlyPlayingTrack && this.currentlyPlayingTrack.path === filepath) {
            return this.pausePlayback(track);
        }
        this.currentlyPlayingTrack = track;

        const playbackFinishedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            mplayer.once('start', () => {
                debug('MPlayer is starting playback.');
            });
            mplayer.once('end', () => {
                debug('MPlayer finished playback.');
                resolve(track);
            });
            mplayer.play(filepath);
        });
        return playbackFinishedPromise;
    }

    async pausePlayback(track) { // eslint-disable-line no-unused-vars
        const that = this;
        const playbackPausedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            if (that.isPaused) {
                debug('MPlayer is resuming playback.');
                mplayer.once('resume', () => {
                    debug('MPlayer resumed playback.');
                    that.isPaused = false;
                    resolve(that.currentlyPlayingTrack);
                });
                mplayer.resume();
            }
            else {
                debug('MPlayer is pausing playback.');
                mplayer.once('pause', () => {
                    debug('MPlayer paused playback.');
                    that.isPaused = true;
                    resolve(that.currentlyPlayingTrack);
                });
                mplayer.pause();
            }
        });
        return playbackPausedPromise;
    }

    async stopPlayback(track) {
        const playbackStoppedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            debug('MPlayer is stopping playback.');
            mplayer.once('stop', () => {
                debug('MPlayer is stopped playback.');
                resolve(track);
            });
            mplayer.stop();
        });
        return playbackStoppedPromise;
    }

};
