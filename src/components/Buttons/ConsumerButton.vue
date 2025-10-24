<script setup lang="ts">
import { ref } from 'vue';

import type { Consumer } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';

const charactersStore = useCharactersStore();

const displayPopup = ref(false);

const { characterName, consumer } = defineProps<{ characterName: string; consumer: Consumer }>();
</script>

<template>
  <div class="consumer-wrapper">
    <button :disabled="!charactersStore.canConsumerBeUsed(characterName, consumer.name)"
      @click.prevent="() => charactersStore.useConsumer(characterName, consumer.name)"
      @mouseover="() => (displayPopup = true)" @mouseout="() => (displayPopup = false)">
      {{ consumer.name }}
    </button>
    <div class="hint" :style="{
      display: displayPopup ? 'block' : 'none',
    }">
      Used: {{ consumer.resource }} <br />
      Cost: {{ consumer.cost }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.consumer-wrapper {
  position: relative;
}

.hint {
  width: max-content;
  border: 1px solid gray;
  background-color: white;
  padding: 0.5rem;
  position: absolute;
  bottom: 101%;
  left: 0;
}
</style>
