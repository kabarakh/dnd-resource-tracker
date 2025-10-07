<script setup lang="ts">
import type { Resource } from '@/interfaces/interfaces';
import { ref } from 'vue';

const { max, current, name } = defineProps<Partial<Resource>>()

const dots = ref<boolean[]>([]);

for (let i = 0; i<max!; i++) {
  dots.value.push(current! <= i)
}
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
    height: .7rem;
    width: .7rem;
    margin-right: .5rem;
  }

  .filled {
    background: black;
  }
}
</style>
