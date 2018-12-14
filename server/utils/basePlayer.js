module.exports = class BasePlayer {
    constructor() {
        if (new.target === BasePlayer) {
            throw new TypeError('Cannot construct BasePlayer instances directly');
        }
        if (this.startPlayback === undefined || typeof this.startPlayback !== 'function') {
            throw new TypeError('Must override startPlayback');
        }
        if (this.stopPlayback === undefined || typeof this.stopPlayback !== 'function') {
            throw new TypeError('Must override stopPlayback');
        }
    }
};
