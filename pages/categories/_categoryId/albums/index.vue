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
    // Must be a number
        return /^\d+$/.test(params.categoryId);
    },
    async asyncData({ app, params }) {
        const response = await app.$axios.$get(`/api/v1/categories/${params.categoryId}/albums`);
        // Not sure how to handle response.status !== 'success'
        return {
            items: response.data,
            group: 'albums',
            itemRouteName: 'categories-categoryId-albums-albumId-tracks',
            itemRouteParams: { categoryId: params.categoryId, next: 'albumId' },
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
