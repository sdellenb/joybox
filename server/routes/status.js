const Router = require('koa-router');
const PlayerStatus = require('../utils/playerStatus');

const router = new Router();
const BASE_URL = '/api/v1/status';

router.get(BASE_URL, async (ctx) => {
    // Don't close the request/stream after handling the route!
    ctx.respond = false;
    const playerStatus = new PlayerStatus(ctx).instance;
    // This sets up the whole SSE magic.
    playerStatus.subscribe(ctx.res);
    // All classes then use publish methods like this to send events to the clients registered on this endpoint.
    playerStatus.publish('debug', 'playerStatus has been initialized.');
});

module.exports = router;
