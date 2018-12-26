const Router = require('koa-router');
const KoaBody = require('koa-body');
const sse = require('sse-broadcast')();

const { debug, error } = require('../utils/logger');
const Player = require('../utils/player');
const queries = require('../db/queries/albums');
const trackQueries = require('../db/queries/tracks');

const router = new Router();
const BASE_URL = '/api/v1/categories/:categoryId/albums';

router.get(BASE_URL, async (ctx) => {
    try {
        const {categoryId} = ctx.params;
        const albums = await queries.getAlbums(categoryId);
        const albumsWithThumbnail = setThumbnailPath(albums);
        ctx.body = {
            status: 'success',
            data: albumsWithThumbnail,
        };
    } catch (err) {
        error(err);
    }
});
  
router.get(`${BASE_URL}/:albumId`, async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        const album = await queries.getSingleAlbum(categoryId, albumId);
        const albumWithThumbnail = setThumbnailPath(album);
        if (albumWithThumbnail.length) {
            ctx.body = {
                status: 'success',
                data: album,
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'That album does not exist.',
            };
        }
    } catch (err) {
        error(err);
    }
});

// For more information on custom methods, see
// https://cloud.google.com/apis/design/custom_methods
// Note: The colon must be escaped, so koa doesn't interpret it as a parameter.
router.post(`${BASE_URL}/:albumId\\:play`, KoaBody(), async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        // TODO: Sanity checks on request body.
        const trackId = ctx.request.body ? ctx.request.body.trackId : null;
        const options = ctx.request.body ? ctx.request.body.options : null;

        let tracks = null;
        if (trackId) {
            tracks = await trackQueries.getSingleTrack(categoryId, albumId, trackId);
        }
        else {
            tracks = await trackQueries.getFirstTrack(categoryId, albumId);
        }
        if (tracks.length) {
            const player = new Player();
            // Don't await to send a response.
            player.startPlayback(tracks[0], options)
                .then((track) => {
                    sse.sendEvent(ctx.res, 'playback-finished', track);
                })
                .catch(error => {
                    sse.sendEvent(ctx.res, 'error', error);
                });
            ctx.body = {
                status: 'success',
                data: tracks,
            };
            sse.sendEvent(ctx.res, 'playback-started', tracks[0]);
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'The requested track does not exist.',
            };
        }
    } catch (err) {
        error(err);
    }
});

router.post(`${BASE_URL}/:albumId\\:pause`, async (ctx) => {
    try {
        const player = new Player();
        // Don't await to send a response.
        player.pausePlayback()
            .then((track) => {
                sse.sendEvent(ctx.res, 'playback-paused', track);
            })
            .catch(error => {
                sse.sendEvent(ctx.res, 'error', error);
            });

        ctx.body = {
            status: 'success',
        };
    } catch (err) {
        error(err);
    }
});

router.post(`${BASE_URL}/:albumId\\:fwd`, KoaBody(), async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        const trackId = ctx.request.body && Number.isInteger(ctx.request.body.trackId) ? ctx.request.body.trackId : null;

        let tracks = null ;
        if (trackId) {
            tracks = await trackQueries.getNextTrack(categoryId, albumId, trackId);
        }
        if (!tracks) {
            tracks = await trackQueries.getFirstTrack(categoryId, albumId);
        }
        if (tracks.length) {
            debug(`Moving on to next track: categoryId: ${categoryId}, albumId: ${albumId}, trackId: ${tracks[0].id}`);
            const player = new Player();
            // Don't await to send a response.
            player.startPlayback(tracks[0])
                .then((track) => {
                    sse.sendEvent(ctx.res, 'playback-finished', track);
                })
                .catch(error => {
                    sse.sendEvent(ctx.res, 'error', error);
                });

            ctx.body = {
                status: 'success',
                data: tracks,
            };
            sse.sendEvent(ctx.res, 'playback-started', tracks[0]);
        } else {
            ctx.status = 404;
            ctx.body = {
                status: 'error',
                message: 'The requested track does not exist or the end of the album was reached.',
            };
        }
    } catch (err) {
        error(err);
    }
});

function setThumbnailPath(albums) {
    return albums.map(album => {
        const thumbnailId = album.thumbnail;
        if (thumbnailId) {
            album.thumbnail = `/generated/thumbnails/${thumbnailId}.jpg`;
        }
        else {
            // Don't pass "null" string value.
            delete album.thumbnail;
        }
        return album;
    });
}

module.exports = router;
