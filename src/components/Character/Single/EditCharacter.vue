<script setup lang="ts">
import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';
import { useTitle } from '@vueuse/core';
import { cloneDeep } from 'lodash';
import { ref } from 'vue';

const charactersStore = useCharactersStore();
const { characterFormData, originalCharacterName, resetCharacterFormData } = defineProps<{
  characterFormData: Partial<Character>, originalCharacterName: string, resetCharacterFormData: () => void
}>();

const localCharacterFormData = ref(cloneDeep(characterFormData));

const saveCharData = () => {
  if (localCharacterFormData.value !== undefined) {
    charactersStore.addOrEditCharacter(originalCharacterName, localCharacterFormData.value);
    resetCharacterFormData();
  }
};

useTitle('Edit ' + originalCharacterName + ' - DnD Resource Tracker');

</script>
<template>
  <section>
    <form @submit.prevent="saveCharData">
      <label>Name: <input type="text" v-model="localCharacterFormData.name" /></label>
      <label>AC: <input type="text" v-model="localCharacterFormData.armorClass" /></label>
      <label>Current HP: <input type="text" v-model="localCharacterFormData.currentHP" /></label>
      <label>Max HP: <input type="text" v-model="localCharacterFormData.maxHP" /></label>
      <label>Perception: <input type="text" v-model="localCharacterFormData.passivePerception" /></label>
      <button type="submit">Save</button>
    </form>
  </section>
</template>
