<template>
    <div 
        v-if="items.length > 0" 
        class="GridView"
    >
        <div
            v-for="item of items"
            :key="item.id"
            class="GridCell"
        >
            <!-- eslint-disable-next-line vue/component-name-in-template-casing -->
            <nuxt-link
                :to="{ name: itemRouteName, params: createRouteParams(item.id) }"
            >
                <div class="GridCellContent">
                    <!-- TODO: Show thumbnail here. -->
                    {{ item.track_index && item.track_index }}
                    {{ item.name }}
                </div>
            </nuxt-link>
        </div>
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
    methods: {
        createRouteParams(itemId) {
            const nextItemRouteParamName = this.itemRouteParams.next;
            let routeParams = Object.assign({}, this.itemRouteParams);
            routeParams[nextItemRouteParamName] = itemId;
            return routeParams;
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
    width: $gridSize;
    height: $gridSize;
    background-color: pink;
    border-radius: 10px;

    .GridCellContent {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: $gridSize;
      height: $gridSize;
    }
  }
}

</style>
