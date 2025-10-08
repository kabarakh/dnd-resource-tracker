<script setup lang="ts">
import type { Resource } from '@/interfaces/interfaces';

const { max, current, name } = defineProps<Partial<Resource>>()
</script>

<template>
  {{ name }}: {{ current }}/{{ max }} <br />
  <div class="bar"><span class="current" :style="{
    width: current! / max! * 100 + '%'
  }"></span></div>
</template>

<style lang="scss" scoped>
.bar {
  width: 200px;
  height: .5rem;
  border-radius: .25rem;
  background: red;
  overflow: hidden;
}

.current {
  display: block;
  height: 100%;
  background-color: green;
}
</style>
