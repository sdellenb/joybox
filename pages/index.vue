<template>
    <GridView
        :items="items"
        :group="group"
        :item-route-name="itemRouteName"
        :item-route-params="itemRouteParams"
    />
</template>

<script>
import GridView from '~/components/GridView.vue';

export default {
    components: {
        GridView,
    },
    async asyncData({ app }) {
        const response = await app.$axios.$get('/api/v1/categories');
        // Not sure how to handle response.status !== 'success'
        return {
            items: response.data.map(item => {
                // The SVG symbols don't look nice filling the whole cell, so show them with a border.
                item.thumbnailWithBorder = true;
                return item;
            }),
            group: 'categories',
            itemRouteName: 'categories-categoryId-albums',
            itemRouteParams: { next: 'categoryId' },
        };
    },
};
</script>
