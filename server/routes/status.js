const Router = require('koa-router');
const sse = require('sse-broadcast')();
const PlayerStatus = require('../utils/playerStatus');

const router = new Router();
const BASE_URL = '/api/v1/status';

router.get(BASE_URL, async (ctx) => {
    // Don't close the request/stream after handling the route!
    ctx.respond = false;
    new PlayerStatus(ctx);
    sse.sendEvent(ctx.res, 'debug', 'playerStatus has been initialized.');
});

module.exports = router;
