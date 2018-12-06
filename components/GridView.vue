<template>
    <div
        v-if="items.length > 0"
        v-touch:swipe="swipeHandler"
        class="GridView"
    >
        <GridCell
            v-for="item of items"
            :key="item.id"
            :content="item.name"
        />
    </div>
</template>

<script>
import GridCell from '~/components/GridCell.vue';

// Dummy data for the Grid.
const numCells = 10;
const items = [];
for(let i = 1; i <= numCells; i++) {
    const album = {
        id: `${i}`,
        name: `Album ${i}`,
    };
    items.push(album);
}

export default {
    components: {
        GridCell,
    },
    data: () => ({
        items: items,
    }),
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
