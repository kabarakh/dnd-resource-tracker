<script setup lang="ts">
import type { Resource } from '@/interfaces/interfaces';

const { max, current, name } = defineProps<Partial<Resource>>()
</script>
<template>
  <div class="resource">
    <div class="name">{{ name }}: </div>
    <div v-for="index in max" :key="index" :class="[
      'dot', {
        filled: index > current!
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
