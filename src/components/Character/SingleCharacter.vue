<script setup lang="ts">
import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';
import { ref } from 'vue';
import ViewCharacter from './Single/ViewCharacter.vue';
import EditCharacter from './Single/EditCharacter.vue';

const charactersStore = useCharactersStore();

const { character, resetSelectedCharacter } = defineProps<{
  character: Character;
  resetSelectedCharacter: () => void;
}>();

const characterFormData = ref<Partial<Character> | undefined>();

const editStats = () => {
  if (characterFormData.value === undefined) {
    characterFormData.value = {
      name: character.name,
      armorClass: character.armorClass,
      currentHP: character.currentHP,
      maxHP: character.maxHP,
      passivePerception: character.passivePerception,
    };
  } else {
    characterFormData.value = undefined;
  }
};


</script>

<template>
  <button @click.prevent="resetSelectedCharacter">back to list</button>
  <ViewCharacter :character="character" v-if="characterFormData === undefined" />
  <EditCharacter :characterFormData="characterFormData" :originalCharacterName="character.name"
    :resetCharacterFormData="editStats" v-else />

  <section>
    <button @click.prevent="resetSelectedCharacter">back to list</button>
    <button @click.prevent="editStats" v-if="characterFormData === undefined">edit {{ character.name }}</button>
    <button @click.prevent="editStats" v-else>cancel</button>
    <button @click.prevent="() => charactersStore.removeCharacter(character.name)">delete {{ character.name }}</button>
  </section>
</template>

<style lang="scss" scoped>
.flex {
  display: flex;
}

.flex-row {
  flex-direction: row;
}
</style>
