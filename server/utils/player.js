const environment = process.env.NODE_ENV || 'development';
const JoyboxConfig = require('../../joybox.config');
const OmxPlayer = require('./omxPlayer');
const FakePlayer = require('./fakePlayer');
const MPlayer = require('./mPlayer');

const players = {
    OmxPlayer,
    FakePlayer,
    MPlayer,
};

let _player = null;

module.exports = class Player {

    constructor(){
        if(_player){
            return _player;
        }

        const configuredPlayerClassName = JoyboxConfig[environment].player;  
        _player = new players[configuredPlayerClassName]();
    }

    async startPlayback(track, options) {
        return _player.startPlayback(track, options);
    }

    async pausePlayback(track) {
        return _player.pausePlayback(track);
    }

    async stopPlayback(track) {
        return _player.stopPlayback(track);
    }
};
