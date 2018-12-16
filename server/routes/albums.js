const Router = require('koa-router');
const KoaBody = require('koa-body');
const { error } = require('../utils/logger');
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
        const startPos = ctx.request.body ? ctx.request.body.startPos : null;

        let track = null;
        if (trackId) {
            track = await trackQueries.getSingleTrack(categoryId, albumId, trackId);
        }
        else {
            track = await trackQueries.getFirstTrack(categoryId, albumId);
        }
        if (track.length) {
            const player = new Player();
            player.startPlayback(track[0].path, startPos); // Don't await.
            ctx.body = {
                status: 'success',
                data: track,
            };
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
        player.pausePlayback(); // Don't await.
        ctx.body = {
            status: 'success',
        };
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
