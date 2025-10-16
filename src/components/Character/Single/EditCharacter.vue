<script setup lang="ts">
import ResourceBar from '@/components/Resources/ResourceBar.vue';
import ResourceDots from '@/components/Resources/ResourceDots.vue';
import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';
import { useTitle } from '@vueuse/core';
import { cloneDeep } from 'lodash';
import { ref } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';

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

const addResource = () => {
  localCharacterFormData.value.resources!.push({
    name: '',
    max: 1,
    current: 0,
    display: 'dots',
    rechargeOnRest: 'long'
  })
};

const deleteResource = (index: number) => {
  localCharacterFormData.value.resources!.splice(index, 1);
}

useTitle('Edit ' + originalCharacterName + ' - DnD Resource Tracker');

</script>
<template>
  <form @submit.prevent="saveCharData">
    <section>
      <label>Name: <input type="text" v-model="localCharacterFormData.name" /></label>
      <label>AC: <input type="text" v-model="localCharacterFormData.armorClass" /></label>
      <label>Current HP: <input type="text" v-model="localCharacterFormData.currentHP" /></label>
      <label>Max HP: <input type="text" v-model="localCharacterFormData.maxHP" /></label>
      <label>Perception: <input type="text" v-model="localCharacterFormData.passivePerception" /></label>

    </section>
    <section>
      <VueDraggable ref="el" v-model="localCharacterFormData.resources!" handle=".handle">
        <div class="resource-element" v-for="resource, index in localCharacterFormData.resources!" :key="index">
          <div class="handle">DnD Handle</div>
          <div>
            <label>Resource Name: <input type="text" v-model="resource.name" /></label>
            <label>Current: <input type="number" min="0" :max="resource.max" v-model="resource.current" /></label>
            <label>Max: <input type="number" min="1" v-model="resource.max" /></label>
            <label>Recharge on: <select v-model="resource.rechargeOnRest">
                <option value="short">Short Rest</option>
                <option value="long">Long Rest</option>
              </select>
            </label>
            <label>Display as: <select v-model="resource.display">
                <option value="dots">Dots</option>
                <option value="bar">Bar</option>
              </select>
            </label>
            <div>
              <button @click.prevent="() => deleteResource(index)">Delete</button>
            </div>
          </div>
          <div>
            <template v-if="resource.display === 'dots'">
              <ResourceDots :current="resource.current" :max="resource.max" :name="resource.name" />
            </template>
            <template v-if="resource.display === 'bar'">
              <ResourceBar :current="resource.current" :max="resource.max" :name="resource.name" />
            </template>
          </div>
        </div>
      </VueDraggable>
      <button @click.prevent="() => addResource()">Add resource</button>
    </section>
    <button type="submit">Save</button>
  </form>
</template>

<style lang="scss" scoped>
label {
  display: block;
}

.resource-element {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: row;
}
</style>
