const Router = require('koa-router');
const sse = require('sse-broadcast')();

const router = new Router();
const BASE_URL = '/api/v1/status';

router.get(BASE_URL, async (ctx) => {
    let time = Date.now();
    
    setInterval(function () {
        sse.sendEvent(ctx.res, 'test-json', { timestamp: Date.now() - time });
    }, 1000);

    // Don't close the request/stream after handling the route!
    ctx.respond = false;
});

module.exports = router;
