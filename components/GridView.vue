<template>
    <div class="GridView">
        <div class="GridCell">
            Grid Cell 1
        </div>
        <div class="GridCell">
            Grid Cell 2
        </div>
        <div class="GridCell">
            Grid Cell 3
        </div>
        <div class="GridCell">
            Grid Cell 4
        </div>
        <div class="GridCell">
            Grid Cell 5
        </div>
        <div class="GridCell">
            Grid Cell 6
        </div>
        <div class="GridCell">
            Grid Cell 7
        </div>
        <div class="GridCell">
            Grid Cell 8
        </div>
        <div class="GridCell">
            Grid Cell 9
        </div>
        <div class="GridCell">
            Grid Cell 10
        </div>
    </div>
</template>

<style lang="scss">
    $gridSpacing: 10px;

    .GridView {
        height: 400px + 2 * $gridSpacing;
        max-height: 400px + 2 * $gridSpacing;
        width: auto;
        overflow: auto;
        overflow-y: hidden;
        display: grid;
        grid-template-columns: 200px 200px 200px;
        grid-template-rows: top 200px bottom 200px;
        grid-column-gap: $gridSpacing;
        grid-row-gap: $gridSpacing;

        .GridCell {
            width: 200px;
            height: 200px;
            background-color: pink;
            border-width: 0px;
            border-color: black;
            border-radius: 10px;
        }
    }

</style>
