<template>
    <div class="AlbumPlayer">
        <div class="AlbumCell">
            <img v-if="album.thumbnail" :src="album.thumbnail" class="AlbumThumbnail" />
            <span v-else class="AlbumName">{{ album.name }}</span>
        </div>
        <div class="PlaybackControls">
            <div class="PlaybackButton Play" @click="playAlbum" />
            <div class="PlaybackButton Pause"  @click="pauseAlbum" />
            <div class="PlaybackButton Rwd" />
            <div class="PlaybackButton Fwd" />
            <div class="PlaybackButton StartOver" />
            <div class="PlaybackButton Stop" />
        </div>
    </div>
</template>

<script>
export default {
    validate({ params }) {
        // Must be numbers
        return /^\d+$/.test(params.categoryId) && /^\d+$/.test(params.albumId);
    },
    data() {
        return {
            route : null,
            currentTrackId: null,
        };
    },
    mounted() {
        const axios = this.$axios; // eslint-disable-line no-unused-vars
        // Code that will run only after the entire view has been rendered
        this.$nextTick(async function () {
            // TODO: Send a POST call to start playback on the backend.
            // const response = await axios.$post(`/api/v1/categories/${params.categoryId}/albums/`);
        });
        this.route = this.$route;
    },
    methods: {
        async playAlbum() {
            let body = null;
            if (this.currentTrackId) {
                // Continue playback.
                body = { trackId: this.currentTrackId };
            }
            const response = await this.$axios.$post(`/api/v1${this.route.path}:play`, body);
            this.currentTrackId = response.data[0].id;
        },
        async pauseAlbum() {
            await this.$axios.$post(`/api/v1${this.route.path}:pause`);
        },
    },
    async asyncData({ app, params }) {
        const response = await app.$axios.$get(`/api/v1/categories/${params.categoryId}/albums/${params.albumId}`);
        // Not sure how to handle response.status !== 'success'
        return {
            album: response.data[0],
        };
    },
};
</script>

<style lang="scss" scoped>
$pageMargin: 40px;
$albumBorder: 3px;
$thumbnailSize: 400px + 2 * $albumBorder;

.AlbumPlayer {
  margin: $pageMargin;
  $albumBorder: 3px;
  height: $thumbnailSize;
  display: flex;
  justify-content: left;
  
    .AlbumCell {
        flex-direction: left;
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: $thumbnailSize;
        height: $thumbnailSize;
        border-radius: $thumbnailSize / 10;
        border: 3px solid black;


        .AlbumThumbnail {
            width: $thumbnailSize - 6px;
            height: $thumbnailSize - 6px;
            border-radius: $thumbnailSize / 10 - 2;
        }

        .AlbumName {
            font-size: 32px;
        }

    }

    .PlaybackControls {
        $buttonSize: 120px;
        $buttonBorderRadius: $buttonSize / 10;
        $buttonBorderWidth: 2px;
        $buttonImageSize: $buttonSize - 2* $buttonBorderRadius - 2 * $buttonBorderWidth;

        margin-left: 20px;
        height: $thumbnailSize;
        display: grid;
        grid-gap: $buttonSize / 6;
        grid-template-rows: $buttonSize;
        grid-template-columns: repeat(2, $buttonSize);
        grid-auto-flow: row;

        .PlaybackButton {
            width: $buttonSize;
            height: $buttonSize;
            padding: $buttonBorderRadius;
            border-radius: $buttonBorderRadius;
            border: 2px solid black;

            @mixin playback-button($url) {
                background: url($url);
                background-repeat: no-repeat;
                background-size: $buttonImageSize;
                background-origin: content-box;
            }

            &.Play {
                @include playback-button('/svg/play.svg');
                filter: invert(.5) sepia(1) saturate(5) hue-rotate(220deg); // Turn it purple!
            }

            &.Pause {
                @include playback-button('/svg/pause.svg');
            }
            
            &.Fwd {
                @include playback-button('/svg/fwd.svg');
            }

            &.Rwd {
                @include playback-button('/svg/rwd.svg');
            }

            &.Stop {
                @include playback-button('/svg/stop.svg');
            }

            &.StartOver {
                @include playback-button('/svg/start.svg');
            }
        }
    }
}

</style>
