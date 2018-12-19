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
                :v-if="itemRouteName"
                :to="{ name: itemRouteName, params: createRouteParams(item.id) }"
            >
                <div class="GridCellContent">
                    <!-- Categories and albums (should) have a thumbnail, if not, show track number or text. -->
                    <img v-if="item.thumbnail" :src="item.thumbnail" class="GridCellContentThumbnail" :class="{ WithBorder: item.thumbnailWithBorder }" />
                    <span v-else-if="item.number" class="GridCellContentNumber">{{ item.number }}</span>
                    <span v-else>{{ item.name }}</span>
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
$pageMargin: 30px;
$gridSize: 200px;
$gridSpacing: 20px;
$numberSize: 60px;

.GridView {
  margin: $pageMargin;
  justify-content: left;
  height: 2 * $gridSize + $gridSpacing;
  max-height: 2 * $gridSize + $gridSpacing;
  width: 3 * $gridSize + 2 * $gridSpacing + $gridSize / 2; // Three and a half tiles.
  overflow: auto; // Horizontal touch scrolling enabled.
  display: grid;
  grid-gap: $gridSpacing;
  grid-template-rows: repeat(2, 200px);
  grid-template-columns: 200px;
  grid-auto-flow: column;

  &::-webkit-scrollbar {
      // We want scrolling, but no scroll bar.
      display: none;
  }

  a {
      color: black;
      text-decoration: none;

      &:visited {
          text-decoration: none;
      }

      &:hover {
          text-decoration: none;
      }

      &:active {
          text-decoration: none;
      }
  }

  .GridCell {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    width: $gridSize;
    height: $gridSize;
    background-color: transparent;
    border-radius: $gridSpacing;
    border-width: thick;
    border-style: solid;

    .GridCellContent {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
      width: $gridSize;
      height: $gridSize;

      &Thumbnail {
        width: $gridSize;
        height: $gridSize;
        border-radius: $gridSpacing;

        &.WithBorder {
            width: $gridSize * 0.65;
            height: $gridSize * 0.65;
            border-radius: 0;
        }
      }

      &Number {
          position: relative;
          top: 50px;
          left: 50px;
          font-size: $numberSize;
      }
    }
  }
}

</style>
