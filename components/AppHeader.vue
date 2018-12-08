<template>
    <div class="AppHeader">
        <span class="app-title">joybox</span>
        <hr>
    </div>
</template>

<style lang="scss" scoped>
.AppHeader {
  position: absolute;
  top: 5px;
  right: 30px;
  text-align: right;

  .app-title {
    font-weight: bold;
    font-style: italic;
    color: rgba($color: purple, $alpha: 0.7);
  }

  hr {
    width: 500px;
  }
}
</style>
