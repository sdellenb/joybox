<template>
    <div
        v-if="items.length > 0"
        v-touch:swipe="swipeHandler"
        class="GridView"
    >
        <GridCell
            v-for="item of items"
            :key="item.id"
            :item="item"
            :group="group"
        />
    </div>
</template>

<script>
import VueTypes from 'vue-types';
import GridCell from '~/components/GridCell.vue';

export default {
    components: {
        GridCell,
    },
    props: {
        items: VueTypes.arrayOf(Object).isRequired,
        group: VueTypes.string.isRequired,
    },
    methods: {
        swipeHandler: (direction) => {
            console.log(`*** Swiped ${direction}`);  // May be left / right / top / bottom
        },
    },
};
</script>

<style lang="scss">
    $gridSize: 200px;
    $gridSpacing: 10px;

    .GridView {
        height: 2 * $gridSize + $gridSpacing;
        max-height: 2 * $gridSize + $gridSpacing;
        width: 3 * $gridSize + 2 * $gridSpacing + $gridSize / 2; // Three and a half tiles.
        overflow: auto; // Touch scrolling enabled.
        display: grid;
        grid-gap: $gridSpacing;
        grid-template-rows: repeat(2, 200px);
        grid-auto-flow: column;
    }

</style>
