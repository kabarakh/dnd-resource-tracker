<script setup lang="ts">
import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';
import { ref } from 'vue';
import ViewCharacter from './Single/ViewCharacter.vue';
import EditCharacter from './Single/EditCharacter.vue';
import { cloneDeep } from 'lodash';

const charactersStore = useCharactersStore();

const { character, resetSelectedCharacter } = defineProps<{
  character: Character;
  resetSelectedCharacter: () => void;
}>();

const characterFormData = ref<Partial<Character> | undefined>();

const editStats = () => {
  if (characterFormData.value === undefined) {
    characterFormData.value = cloneDeep(character);
  } else {
    characterFormData.value = undefined;
  }
};

import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<template>
  <button @click.prevent="resetSelectedCharacter">{{ t('app.backToList') }}</button>
  <ViewCharacter :character="character" v-if="characterFormData === undefined" />
  <EditCharacter
    :characterFormData="characterFormData"
    :originalCharacterName="character.name"
    :resetCharacterFormData="editStats"
    v-else
  />

  <section>
    <button @click.prevent="resetSelectedCharacter">{{ t('app.backToList') }}</button>
    <button @click.prevent="editStats" v-if="characterFormData === undefined">{{ t('app.editCharacter', {character: character.name}) }}</button>
    <button @click.prevent="editStats" v-else>{{ t('app.cancel') }}</button>
    <button @click.prevent="() => charactersStore.removeCharacter(character.name)">{{ t('app.deleteCharacter', {character: character.name}) }}</button>
  </section>
</template>

<style lang="scss">
.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}
</style>
