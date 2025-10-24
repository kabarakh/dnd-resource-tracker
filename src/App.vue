<script setup lang="ts">
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTitle } from '@vueuse/core';
import { useI18n } from 'vue-i18n'

import { useCharactersStore } from './stores/characters';
import { type Character } from './interfaces/interfaces';
import SingleCharacter from './components/Character/SingleCharacter.vue';

const charactersStore = useCharactersStore();
const { t, locale } = useI18n()

const { characters } = storeToRefs(charactersStore);

const newCharName = ref('');
const selectedCharName = ref<string>('');
const selectedChar = ref<Character | undefined>();
const existingChar = ref<Character | undefined>();
const localLocale = ref(locale.value)

watch([selectedCharName, characters], () => {
  selectedChar.value = charactersStore.findCharacterByName(selectedCharName.value);
});

watch([newCharName, characters], () => {
  existingChar.value = charactersStore.findCharacterByName(newCharName.value);
});

watch(localLocale, () => {
  localStorage.setItem('locale', localLocale.value);
  locale.value = localLocale.value;
});

const addChar = () => {
  charactersStore.addOrEditCharacter(newCharName.value, {});
  newCharName.value = '';
};


const resetSelectedChar = () => {
  selectedCharName.value = '';
};

useTitle('DnD Resource Tracker');
</script>

<template>
  <header>
    <h1>DnD Resource Tracker</h1>
    <label>
      {{ t('app.language') }}
      <select v-model="localLocale">
        <option value="en">English</option>
        <option value="de">Deutsch</option>
      </select>
    </label>
  </header>
  <main>
    <template v-if="selectedChar === undefined">
      <div v-for="character in characters" :key="character.name">
        <button @click.prevent="() => (selectedCharName = character.name)">{{ character.name }}</button>
      </div>

      <form @submit.prevent="addChar">
        <input v-model="newCharName" />
        <input :disabled="newCharName.length === 0 || existingChar !== undefined" type="submit"
          :value="t('app.newCharacter')" />
      </form>
    </template>

    <template v-else>
      <SingleCharacter :character="selectedChar" :resetSelectedCharacter="resetSelectedChar" />
    </template>
  </main>

  <footer>
    <a href="mailto:github@kabarakh.de?subject=[DnD Resource Tracker] Issue">{{ t('footer.reportIssue') }}</a>
    <a href="https://github.com/kabarakh/dnd-resource-tracker" target="_blank">{{ t('footer.source') }}</a>
    <a href="/imprint">{{ t('footer.imprint') }}</a>
  </footer>
</template>

<style lang="scss">
section {
  padding: 1rem;
  border-bottom: 1px solid gray;
}

button {
  margin-right: 0.5rem;
}

main {
  margin-bottom: 6.5rem;
}

footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  border-top: 2px solid gray;
  background-color: white;


  >* {
    margin-bottom: .5rem;
  }
}
</style>
