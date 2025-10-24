<script setup lang="ts">
import { ref } from 'vue';

import type { SpecialRecharge } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';

const charactersStore = useCharactersStore();

const displayPopup = ref(false);

const { characterName, recharger } = defineProps<{ characterName: string; recharger: SpecialRecharge }>();
</script>

<template>
  <div class="recharger-wrapper">
    <button :disabled="!charactersStore.canSpecialRechargerBeUsed(characterName, recharger.name)"
      @click.prevent="() => charactersStore.useSpecialRecharger(characterName, recharger.name)"
      @mouseover="() => (displayPopup = true)" @mouseout="() => (displayPopup = false)">
      {{ recharger.name }}
    </button>
    <div class="hint" :style="{
      display: displayPopup ? 'block' : 'none',
    }">
      Used: {{ recharger.resourceUsed }} <br />
      Cost: {{ recharger.usedCount }} <br />
      Refills: {{ recharger.resourceRecharged }}<br />
      Refill Count: {{ recharger.rechargeCount }}
    </div>
  </div>
</template>
<style lang="scss" scoped>
.recharger-wrapper {
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
