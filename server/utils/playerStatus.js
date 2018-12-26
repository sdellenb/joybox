const sse = require('sse-broadcast')();
const assert = require('assert');

let _playerStatus = null;

module.exports = class PlayerStatus {

    constructor(ctx){
        if(_playerStatus){
            assert.ok(_playerStatus.ctx, 'ctx is invalid.');
            return _playerStatus;
        }

        assert.ok(ctx, 'Parameter ctx is required.');
        this.ctx = ctx;
        _playerStatus = this;
    }

    /**
     * Send a message to a specified subscriber.
     *
     * @param {string|object} eventOrOptions Event name or an options object that specifies the message.
     * @param {string} [eventOrOptions.id]    Optional event identifier.
     * @param {string} [eventOrOptions.event] Event name.
     * @param {string} [eventOrOptions.data]  Optional event payload.
     * @param {string} [eventOrOptions.retry] Optional retry time for the receiver.
     * @param {*} [data] Optional event payload.
     * @param {function(Error?)} [callback]
     */
    static sendEvent(eventOrOptions, data, callback) {
        sse.sendEvent(_playerStatus.ctx.res, _playerStatus.ctx.req, eventOrOptions, data, callback);
    }
};
