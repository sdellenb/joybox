<template>
    <div class="AlbumPlayer">
        <div class="AlbumCell">
            <img v-if="album.thumbnail" :src="album.thumbnail" class="AlbumThumbnail" />
            <span v-else class="AlbumName">{{ album.name }}</span>
        </div>
        <div class="PlaybackControls">
            <div v-if="!currentlyPlaying || isPaused" class="PlaybackButton Big Play" @click="playAlbum" />
            <div v-else class="PlaybackButton Big Pause" @click="pauseAlbum" />
            <div class="PlaybackButton StartOver Disabled" />
            <div class="PlaybackButton Rwd Disabled" />
            <div class="PlaybackButton Fwd" :class="{ Disabled: !currentlyPlaying }" @click="forwardTrack" />
            <!-- <div class="PlaybackButton Stop" /> -->
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
            currentlyPlaying: false,
            isPaused: false,
        };
    },
    created() {
        this.setupServerListener();
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
        setupServerListener() {
            let es = new EventSource('/api/v1/status');

            es.addEventListener('playback-started', event => {
                let track = JSON.parse(event.data);
                this.currentTrackId = track.id;
                this.currentlyPlaying = true;
                this.isPaused = false;
            }, false);

            es.addEventListener('playback-paused', event => {
                let track = JSON.parse(event.data);
                this.currentTrackId = track.id;
                this.currentlyPlaying = true;
                this.isPaused = true;
            }, false);

            es.addEventListener('playback-finished', event => {
                let track = JSON.parse(event.data);
                this.currentTrackId = track.id;
                this.currentlyPlaying = false;
                this.isPaused = false;
                this.forwardTrack();
            }, false);

            es.addEventListener('error', event => {
                if (event.readyState == EventSource.CLOSED) {
                    console.error('Event was closed');
                    console.error(EventSource);
                }
            }, false);
        },
        playAlbum() {
            let body = null;
            if (this.currentTrackId) {
                // Continue playback.
                body = { trackId: this.currentTrackId };
            }
            this.$axios.$post(`/api/v1${this.route.path}:play`, body);
        },
        pauseAlbum() {
            this.$axios.$post(`/api/v1${this.route.path}:pause`);
        },
        forwardTrack() {
            let body = null;
            if (this.currentTrackId) {
                // Continue playback.
                body = { trackId: this.currentTrackId };
            }
            this.$axios.$post(`/api/v1${this.route.path}:fwd`, body);
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
$pageMargin: 40px 20px 20px 40px;
$albumBorder: 3px;
$thumbnailSize: 400px + 2 * $albumBorder;

.AlbumPlayer {
  margin: $pageMargin;
  $albumBorder: 3px;
  height: $thumbnailSize;
  display: flex;
  justify-content: left;

  &::-webkit-scrollbar {
      display: none;
  }
  
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
        $buttonBorderWidth: 2px;
        $buttonSize: 90px;
        $buttonBorderRadius: $buttonSize / 10;
        $buttonImageSize: ($buttonSize - 2 * $buttonBorderRadius - 2 * $buttonBorderWidth) !default;
        $largeButtonSize: 300px;
        $largeButtonBorderRadius: $largeButtonSize / 10;
        $largeButtonImageSize: $largeButtonSize - 2 * $largeButtonBorderRadius - 2 * $buttonBorderWidth;

        margin-left: 20px;
        height: $thumbnailSize;
        display: grid;
        grid-gap: $buttonSize / 6;
        grid-template-rows: $buttonSize;
        grid-template-columns: repeat(3, $buttonSize);
        grid-auto-flow: row;

        .PlaybackButton {
            width: $buttonSize;
            height: $buttonSize;
            padding: $buttonBorderRadius;
            border-radius: $buttonBorderRadius;
            border: 2px solid black;
            grid-row-start: 3;

            @mixin playback-button($url, $imageSize: $buttonImageSize) {
                background: url($url);
                background-repeat: no-repeat;
                background-size: $imageSize;
                background-origin: content-box;
            }

            &.Disabled {
                filter: invert(.5) saturate(0);
            }

            &.Big {
                $buttonRatio: 3;
                width: $largeButtonSize;
                height: $largeButtonSize;
                border-radius: $largeButtonBorderRadius;
                padding: $largeButtonBorderRadius;
                grid-column-start: 1;
                grid-column-end: 3;
                grid-row-start: 1;
                grid-row-end: 3;

                &.Play {
                    @include playback-button('/svg/play.svg', $largeButtonImageSize);
                    // filter: invert(.5) sepia(1) saturate(5) hue-rotate(220deg); // Turn it purple!
                }

                &.Pause {
                    @include playback-button('/svg/pause.svg', $largeButtonImageSize);
                }

            }

            &.StartOver {
                @include playback-button('/svg/start.svg');
            }

            &.Rwd {
                @include playback-button('/svg/rwd.svg');
            }

            &.Fwd {
                @include playback-button('/svg/fwd.svg');
            }

            // &.Stop {
            //     @include playback-button('/svg/stop.svg');
            // }
        }
    }
}

</style>
