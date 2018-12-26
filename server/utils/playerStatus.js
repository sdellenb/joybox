const sse = require('sse-broadcast')();
const SSE_CHANNEL='joybox';

class PlayerStatusInstance {
    subscribe(res) {
        sse.subscribe(SSE_CHANNEL, res);
    }

    publish(event, data) {
        sse.publish(SSE_CHANNEL, event, data);
    }
}

module.exports = class PlayerStatus {
    constructor(){
        if (!PlayerStatus.instance) {
            PlayerStatus.instance = new PlayerStatusInstance();
        }
    }

    get instance() { return PlayerStatus.instance; }
};
