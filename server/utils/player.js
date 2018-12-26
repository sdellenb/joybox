const environment = process.env.NODE_ENV || 'development';
const JoyboxConfig = require('../../joybox.config');
const OmxPlayer = require('./omxPlayer');
const FakePlayer = require('./fakePlayer');

const players = {
    OmxPlayer,
    FakePlayer,
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

    async pausePlayback() {
        return _player.pausePlayback();
    }

    async stopPlayback() {
        return _player.stopPlayback();
    }
};
