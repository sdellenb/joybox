<template>
    <section class="container">
        <div>
            <GridView
                :items="items"
                :group="group"
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
    async asyncData({ app }) {
        const response = await app.$axios.$get('/api/v1/categories');
        // Not sure how to handle response.status !== 'success'
        return {
            items: response.data,
            group: 'categories',
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
