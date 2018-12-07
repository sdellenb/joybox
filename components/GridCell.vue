<template>
    <div
        :id="item.id"
        class="GridCell"
        @click="selectCell($event)"
    >
        {{ item.name }}
    </div>
</template>

<script>
const idRegExp = new RegExp(/^([a-z]+)-([0-9]+)$/);

export default {
    props: {
        item: {
            type: Object,
            required: true,
            // id must be a type string and a number with a hyphen in between.
            validator: (value) => (idRegExp.test(value.id)),
        },
    },
    methods: {
        selectCell: (event) => {
            const [ /* unused */, type, id ] = idRegExp.exec(event.target.id);
            console.log(`*** You selected ${type} with id '${id}'`);
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

        &::selection {
            background-color: purple;
        }
    }

</style>
