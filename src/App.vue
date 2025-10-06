<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCharactersStore } from './stores/characters';
import { type Character } from './interfaces/interfaces';
import { storeToRefs } from 'pinia'

const charactersStore = useCharactersStore();
const { characters } = storeToRefs(charactersStore);

const newCharName = ref('');
const hpChange = ref(0);

const addChar = () => {
  charactersStore.addOrEditCharacter(newCharName.value, {});
}

const selectedCharName = ref<string>('');
const selectedChar = ref<Character | undefined>();

watch([selectedCharName, characters], () => {
  selectedChar.value = charactersStore.findCharacterByName(selectedCharName.value);
});

</script>

<template>
  <template v-if="selectedChar === undefined">
    <div v-for="character in characters" :key="character.name">
      <button @click.prevent="() => selectedCharName = character.name">{{ character.name }}</button>
    </div>

    <form @submit.prevent="addChar">
      <input v-model="newCharName" />
      <input type="submit" value="New Char" />
    </form>
  </template>

  <template v-else>
    <button @click.prevent="() => selectedChar = undefined">back</button>
    <section>
      <div>Name: {{ selectedChar.name }}</div>
      <div>HP: {{ selectedChar.currentHP }}/{{ selectedChar.maxHP }}</div>
      <div>Armor Class: {{ selectedChar.armorClass }}</div>
      <div>Passive Perception: {{ selectedChar.passivePerception }}</div>

      <form @submit.prevent="() => {
        charactersStore.changeCurrentHp(selectedChar!.name, hpChange);
      }">
        <input type="number" v-model="hpChange" />
        <input type="submit" value="Change HP" />
      </form>
    </section>
  </template>
</template>
