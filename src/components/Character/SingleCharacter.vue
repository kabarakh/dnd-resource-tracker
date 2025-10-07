<script setup lang="ts">
import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';
import { ref } from 'vue';
import ResourceDots from './ResourceDots.vue';

const charactersStore = useCharactersStore();

const { character, resetSelectedCharacter } = defineProps<{ character: Character, resetSelectedCharacter: () => void }>()

const hpChange = ref(0);
const characterFormData = ref<Partial<Character> | undefined>();

const editStats = () => {
  if (characterFormData.value === undefined) {
    characterFormData.value = {
      name: character.name,
      armorClass: character.armorClass,
      currentHP: character.currentHP,
      maxHP: character.maxHP,
      passivePerception: character.passivePerception
    }
  } else {
    characterFormData.value = undefined;
  }
}

const saveCharData = () => {
  if (characterFormData.value !== undefined) {
    charactersStore.addOrEditCharacter(character.name, characterFormData.value)
    characterFormData.value = undefined;
  }
}

</script>

<template>
  <button @click.prevent="resetSelectedCharacter">back</button>
  <section>
    <div>Name: {{ character.name }}</div>
    <div>HP: {{ character.currentHP }}/{{ character.maxHP }} <br />
      <div class="hp-bar"><span class="current-hp" :style="{
        width: character.currentHP / character.maxHP * 100 + '%'
      }"></span></div>
    </div>
    <div>Armor Class: {{ character.armorClass }}</div>
    <div>Passive Perception: {{ character.passivePerception }}</div>
    <hr />
    <ul>
      <li v-for="resource, index in character.resources" :key="index">
        <ResourceDots :current="resource.current" :max="resource.max" :name="resource.name" />
      </li>
    </ul>
    <form @submit.prevent="() => {
      charactersStore.changeCurrentHp(character.name, hpChange);
    }">
      <input type="number" v-model="hpChange" />
      <input type="submit" value="Change HP" />
    </form>
  </section>
  <section v-if="characterFormData">
    <form @submit.prevent="saveCharData">
      <label>Name: <input type="text" v-model="characterFormData.name" /></label>
      <label>AC: <input type="text" v-model="characterFormData.armorClass" /></label>
      <label>Current HP: <input type="text" v-model="characterFormData.currentHP" /></label>
      <label>Max HP: <input type="text" v-model="characterFormData.maxHP" /></label>
      <label>Perception: <input type="text" v-model="characterFormData.passivePerception" /></label>
      <button type="submit">Save</button>
    </form>
  </section>
  <section>
    <button @click.prevent="resetSelectedCharacter">back</button>
    <button @click.prevent="editStats">edit {{ character.name }}</button>
    <button @click.prevent="() => charactersStore.removeCharacter(character.name)">delete {{ character.name }}</button>
  </section>
</template>

<style lang="scss" scoped>
.hp-bar {
  width: 200px;
  height: .5rem;
  border-radius: .25rem;
  background: red;
  overflow: hidden;
}

.current-hp {
  display: block;
  height: 100%;
  background-color: green;
}
</style>
