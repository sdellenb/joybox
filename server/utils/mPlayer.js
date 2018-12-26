const { AudioPlayer } = require('play-sound-mplayer');
const mplayer = new AudioPlayer();
const jetpack = require('fs-jetpack');
const { debug } = require('./logger');
const BasePlayer = require('./basePlayer');

module.exports = class MPlayer extends BasePlayer {

    constructor() {
        super();
        this.currentlyPlayingTrack = null;
    }

    async startPlayback(track) {
        const filepath = track.path;
        // TODO: Introduce custom exceptions the return the proper status?
        if (jetpack.exists(filepath) !== 'file') {
            return;
        }

        if (mplayer.isPlaying || mplayer.isPaused) {
            // If we're still on the same file, continue playing.
            if (this.currentlyPlayingTrack && this.currentlyPlayingTrack.path === filepath) {
                return this.pausePlayback(track);
            }
            else {
                await this.stopPlayback(this.currentlyPlayingTrack);
            }
        }

        this.currentlyPlayingTrack = track;

        const playbackFinishedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            mplayer.once('start', () => {
                debug(`MPlayer is starting playback of ${JSON.stringify(track)}.`);
            });
            mplayer.once('end', () => {
                debug(`MPlayer finished playback of ${JSON.stringify(track)}.`);
                resolve(track);
            });
            mplayer.play(filepath);
        });
        return playbackFinishedPromise;
    }

    async pausePlayback(track) { // eslint-disable-line no-unused-vars
        const that = this;
        const playbackPausedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            if (mplayer.isPaused) {
                debug(`MPlayer is resuming playback of ${JSON.stringify(that.currentlyPlayingTrack)}.`);
                mplayer.once('resume', () => {
                    debug(`MPlayer resumed playback of ${JSON.stringify(that.currentlyPlayingTrack)}.`);
                    resolve(that.currentlyPlayingTrack);
                });
                mplayer.resume();
            }
            else {
                debug(`MPlayer is pausing playback of ${JSON.stringify(that.currentlyPlayingTrack)}.`);
                mplayer.once('pause', () => {
                    debug(`MPlayer paused playback of ${JSON.stringify(that.currentlyPlayingTrack)}.`);
                    resolve(that.currentlyPlayingTrack);
                });
                mplayer.pause();
            }
        });
        return playbackPausedPromise;
    }

    async stopPlayback(track) {
        const playbackStoppedPromise = new Promise(function(resolve, reject) { // eslint-disable-line no-unused-vars
            if (mplayer.isPlaying || mplayer.isPaused) {
                debug(`MPlayer is stopping playback of ${JSON.stringify(track)}.`);
                mplayer.once('stop', () => {
                    debug(`MPlayer stopped playback of ${JSON.stringify(track)}.`);
                    resolve(track);
                });
                mplayer.stop();
            }
            else {
                reject('MPlayer not running.');
            }

        });
        return playbackStoppedPromise;
    }

};
