<template>
    <div
        v-if="items.length > 0"
        v-touch:swipe="swipeHandler"
        class="GridView"
    >
        <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
        <nuxt-link
            v-for="item of items"
            :key="item.id"
            :to="{ name: itemRouteName, params: createRouteParams(item.id) }"
        >
            <!-- TODO: Show thumbnail here. -->
            <div
                :style="style"
                class="GridCell"
            >
                {{ item.name }}
            </div>
        </nuxt-link>
    </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
    props: {
        items: VueTypes.arrayOf(Object).isRequired,
        group: VueTypes.string.isRequired,
        itemRouteName: VueTypes.string,
        itemRouteParams: VueTypes.object,
    },
    computed: {
        style() {
            let backgroundColor = null;
            switch(this.group) {
            case 'categories':
                backgroundColor='pink';
                break;
            case 'albums':
                backgroundColor='purple';
                break;
            case 'tracks':
                backgroundColor='green';
                break;
            default:
                backgroundColor='red';
            }
            return `background-color: ${backgroundColor};`;
        },
    },
    methods: {
        createRouteParams(itemId) {
            const nextItemRouteParamName = this.itemRouteParams.next;
            let routeParams = Object.assign({}, this.itemRouteParams);
            routeParams[nextItemRouteParamName] = itemId;
            console.log(this.itemRouteName);
            console.log(routeParams);
            return routeParams;
        },
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

        .GridCell {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            width: 200px;
            height: 200px;
            // background-color: pink;
            border-width: 0px;
            border-color: black;
            border-radius: 10px;
        }
    }

</style>
