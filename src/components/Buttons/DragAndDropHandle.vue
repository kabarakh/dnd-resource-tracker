<template>
  <div class="handle">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</template>

<style lang="scss" scoped>
.handle {
  display: grid;
  grid-template-columns: repeat(2, 3px);
  grid-template-rows: repeat(3, 3px);
  grid-column-gap: 3px;
  grid-row-gap: 4px;
  cursor: grab;
}

.dot {
  height: 4px;
  width: 4px;
  background-color: gray;
  border-radius: 50%;
}
</style>
