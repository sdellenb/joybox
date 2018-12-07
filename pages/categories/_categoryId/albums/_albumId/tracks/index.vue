<template>
    <section class="container">
        <div>
            <GridView
                :items="items"
                :group="group"
                :item-route-name="itemRouteName"
                :item-route-params="itemRouteParams"
            />
        </div>
    </section>
</template>

<script>
import GridView from '~/components/GridView.vue';

export default {
    components: {
        GridView,
    },
    validate({ params }) {
    // Must be numbers
        return /^\d+$/.test(params.categoryId) && /^\d+$/.test(params.albumId);
    },
    async asyncData({ app, params }) {
        const response = await app.$axios.$get(`/api/v1/categories/${params.categoryId}/albums/${params.albumId}/tracks`);
        // Not sure how to handle response.status !== 'success'

        // TODO: The tracks response is slightly different that categories and albums.
        // Transform it to have the properties the GridView expects.
        let items = response.data.map(track => {
            return {
                id: track.id,
                name: track.path.substring(track.path.lastIndexOf('\\') + 1),
            };
        });
        return {
            items: items,
            group: 'tracks',
            itemRouteName: 'categories-categoryId-albums-albumId-tracks-trackId',
            itemRouteParams: { categoryId: params.categoryId, albumId: params.albumId, next: 'trackId' },
        };
    },
};
</script>

<style>

.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
