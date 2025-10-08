<script setup lang="ts">
import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';
import { ref } from 'vue';
import ResourceDots from '../Resources/ResourceDots.vue';
import ResourceBar from '../Resources/ResourceBar.vue';

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
    <div>
      <ResourceBar :current="character.currentHP" :max="character.maxHP" name="HP" />
      <form @submit.prevent="() => {
        charactersStore.changeCurrentHp(character.name, hpChange);
      }">
        <input type="number" v-model="hpChange" />
        <input type="submit" value="Change HP" />
      </form>
    </div>
    <div>Armor Class: {{ character.armorClass }}</div>
    <div>Passive Perception: {{ character.passivePerception }}</div>
    <hr />
    <ul>
      <li v-for="resource, index in character.resources" :key="index">
        <template v-if="resource.display === 'dots'">
          <ResourceDots :current="resource.current" :max="resource.max" :name="resource.name" />
        </template>
        <template v-if="resource.display === 'bar'">
          <ResourceBar :current="resource.current" :max="resource.max" :name="resource.name" />
        </template>
      </li>
    </ul>
  </section>
  <section></section>
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
    <button v-for="consumer, index in character.consumers" :key="index"
      @click.prevent="() => charactersStore.useConsumer(character.name, consumer.name)">{{ consumer.name }}</button>
  </section>
  <section>
    <button @click.prevent="() => charactersStore.rest(character.name, 'short')">Short Rest</button>
    <button @click.prevent="() => charactersStore.rest(character.name, 'long')">Long Rest</button>
  </section>
  <section>
    <button @click.prevent="resetSelectedCharacter">back</button>
    <button @click.prevent="editStats">edit {{ character.name }}</button>
    <button @click.prevent="() => charactersStore.removeCharacter(character.name)">delete {{ character.name }}</button>
  </section>
</template>
