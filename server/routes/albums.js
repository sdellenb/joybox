const Router = require('koa-router');
const KoaBody = require('koa-body');
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
        console.log(err);
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
        console.log(err);
    }
});

router.post(`${BASE_URL}/:albumId/play`, KoaBody(), async (ctx) => {
    try {
        const {categoryId, albumId} = ctx.params;
        const body = ctx.request.body;
        let track = null;
        if (body.trackId) {
            track = await trackQueries.getSingleTrack(categoryId, albumId, body.trackId);
        }
        else {
            track = await trackQueries.getFirstTrack(categoryId, albumId);
        }
        if (track.length) {
            // TODO: Start (interactable?) background process with the media player.
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
        console.log(err);
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
