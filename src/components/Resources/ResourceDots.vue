<script setup lang="ts">
import type { Resource } from '@/interfaces/interfaces';
import { ref, watch, watchEffect } from 'vue';

const { max, current, name } = defineProps<Partial<Resource>>()
const dots = ref<boolean[]>([]);

watchEffect(() => {
  const newDots: boolean[] = [];
  for (let i = 0; i < max!; i++) {
    newDots.push(current! <= i)
  }
  dots.value = newDots;
});
</script>
<template>
  <div class="resource">
    <div class="name">{{ name }}: </div>
    <div v-for="filled, index in dots" :key="index" :class="[
      'dot', {
        filled: filled
      }
    ]"></div>
  </div>
</template>
<style lang="scss" scoped>
.resource {
  display: flex;
  align-items: center;
  margin-bottom: .5rem;
  max-width: 50rem;

  .name {
    margin-right: 1rem;
    width: 15%;
  }

  .dot {
    border-radius: 50%;
    border: 1px solid black;
    height: .75rem;
    width: .75rem;
    margin-right: .5rem;
  }

  .filled::before {
    content: ' ';
    display: block;
    height: 100%;
    width: 100%;
    border: 2px solid white;
    box-sizing: border-box;
    border-radius: 50%;
    background: black;
  }
}
</style>
