<script setup lang="ts">
import { ref } from 'vue';
import { cloneDeep } from 'lodash';
import { useI18n } from 'vue-i18n'

import ViewCharacter from './Single/ViewCharacter.vue';
import EditCharacter from './Single/EditCharacter.vue';

import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';

const charactersStore = useCharactersStore();
const { t } = useI18n()

const characterFormData = ref<Partial<Character> | undefined>();

const { character, resetSelectedCharacter } = defineProps<{
  character: Character;
  resetSelectedCharacter: () => void;
}>();

const editStats = () => {
  if (characterFormData.value === undefined) {
    characterFormData.value = cloneDeep(character);
  } else {
    characterFormData.value = undefined;
  }
};
</script>

<template>
  <button @click.prevent="resetSelectedCharacter">{{ t('app.backToList') }}</button>
  <ViewCharacter :character="character" v-if="characterFormData === undefined" />
  <EditCharacter :characterFormData="characterFormData" :originalCharacterName="character.name"
    :resetCharacterFormData="editStats" v-else />

  <section>
    <button @click.prevent="resetSelectedCharacter">{{ t('app.backToList') }}</button>
    <button @click.prevent="editStats" v-if="characterFormData === undefined">{{ t('app.editCharacter', {
      character:
        character.name
    }) }}</button>
    <button @click.prevent="editStats" v-else>{{ t('app.cancel') }}</button>
    <button @click.prevent="() => charactersStore.removeCharacter(character.name)">{{ t('app.deleteCharacter',
      { character: character.name }) }}</button>
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
