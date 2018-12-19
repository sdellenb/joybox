const Router = require('koa-router');
const KoaBody = require('koa-body');
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
        const startPos = ctx.request.body ? ctx.request.body.startPos : null;

        let tracks = null;
        if (trackId) {
            tracks = await trackQueries.getSingleTrack(categoryId, albumId, trackId);
        }
        else {
            tracks = await trackQueries.getFirstTrack(categoryId, albumId);
        }
        if (tracks.length) {
            const player = new Player();
            // TODO: Pass whole track row so the promise can be resolved with all information.
            player.startPlayback(tracks[0].path, startPos)
                .then(() => {
                    debug(`Moving on to next track: categoryId: ${categoryId}, albumId: ${albumId}, trackId: ${tracks[0].id}`);
                    playNextTrack(categoryId, albumId, tracks[0].id)
                        .catch(err => error(err));
                });
            // Don't wait to send a response.
            ctx.body = {
                status: 'success',
                data: tracks,
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

router.post(`${BASE_URL}/:albumId\\:fwd`, KoaBody(), async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        const trackId = ctx.request.body && Number.isInteger(ctx.request.body.trackId) ? ctx.request.body.trackId : null;

        playNextTrack(categoryId, albumId, trackId).then(
            (track) => {
                ctx.body = {
                    status: 'success',
                    data: track,
                };
            },
            (errorMessage) => {
                ctx.status = 404;
                ctx.body = {
                    status: 'error',
                    message: errorMessage,
                };
    
            }
        );
    } catch (err) {
        error(err);
    }
});

async function playNextTrack(categoryId, albumId, trackId) {
    return new Promise(async function(resolve, reject) {
        let tracks = null ;
        if (trackId) {
            tracks = await trackQueries.getNextTrack(categoryId, albumId, trackId);
        }
        if (!tracks) {
            tracks = await trackQueries.getFirstTrack(categoryId, albumId);
        }
        if (tracks.length) {
            resolve(tracks); // We found a track that we're going to play. Respond to client.
            const player = new Player();
            // TODO: Pass whole track row so the promise can be resolved with all information.
            player.startPlayback(tracks[0].path)
                .then(async () => {
                    debug(`Moving on to next track: categoryId: ${categoryId}, albumId: ${albumId}, trackId: ${tracks[0].id}`);
                    playNextTrack(categoryId, albumId, tracks[0].id)
                        .catch(err => error(err));
                    // TODO: Notify client about track change.
                });
        }
        else {
            reject('The requested track does not exist or the end of the album was reached.');
        }    
    });
}

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
