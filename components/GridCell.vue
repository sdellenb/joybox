<template>
    <div
        :id="item.id"
        :title="item.name"
        :group="group"
        class="GridCell"
        @click="selectCell($event)"
    >
        {{ item.name }}
    </div>
</template>

<script>
import VueTypes from 'vue-types';

export default {
    props: {
        item: VueTypes.object.isRequired,
        group: VueTypes.string.isRequired,
    },
    methods: {
        selectCell: (event) => {
            console.log(`*** You selected ${event.target.attributes.group.value} with id '${event.target.id}'`);
            // TODO: Route to the page that fits the next level. Will need an additional property from the container.
        },
    },
};
</script>

<style lang="scss">
    .GridCell {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: 200px;
        height: 200px;
        background-color: pink;
        border-width: 0px;
        border-color: black;
        border-radius: 10px;
    }

</style>
