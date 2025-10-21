<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCharactersStore } from './stores/characters';
import { type Character } from './interfaces/interfaces';
import { storeToRefs } from 'pinia';
import SingleCharacter from './components/Character/SingleCharacter.vue';
import { useTitle } from '@vueuse/core';

const charactersStore = useCharactersStore();
const { characters } = storeToRefs(charactersStore);

const newCharName = ref('');

const addChar = () => {
  charactersStore.addOrEditCharacter(newCharName.value, {});
  newCharName.value = '';
};

const selectedCharName = ref<string>('');
const selectedChar = ref<Character | undefined>();
const existingChar = ref<Character | undefined>();

const resetSelectedChar = () => {
  selectedCharName.value = '';
};

watch([selectedCharName, characters], () => {
  selectedChar.value = charactersStore.findCharacterByName(selectedCharName.value);
});

watch([newCharName, characters], () => {
  existingChar.value = charactersStore.findCharacterByName(newCharName.value);
});

useTitle('DnD Resource Tracker');
</script>

<template>
  <template v-if="selectedChar === undefined">
    <div v-for="character in characters" :key="character.name">
      <button @click.prevent="() => (selectedCharName = character.name)">{{ character.name }}</button>
    </div>

    <form @submit.prevent="addChar">
      <input v-model="newCharName" />
      <input :disabled="newCharName.length === 0 || existingChar !== undefined" type="submit" value="New Char" />
    </form>
  </template>

  <template v-else>
    <SingleCharacter :character="selectedChar" :resetSelectedCharacter="resetSelectedChar" />
  </template>
</template>

<style lang="scss">
section {
  padding: 1rem;
  border-bottom: 1px solid gray;
}

button {
  margin-right: 0.5rem;
}
</style>
