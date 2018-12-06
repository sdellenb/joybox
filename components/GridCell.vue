<template>
    <div
        class="GridCell"
        @click="selectCell"
    >
        {{ content }}
    </div>
</template>

<script>
export default {
    props: { content: { type: String, required: true } },
    methods: {
        selectCell: (args) => {
            console.log(args);
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
