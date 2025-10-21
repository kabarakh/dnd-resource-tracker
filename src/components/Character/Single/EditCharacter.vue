<script setup lang="ts">
import DragAndDropHandle from '@/components/Buttons/DragAndDropHandle.vue';
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
  characterFormData: Partial<Character>;
  originalCharacterName: string;
  resetCharacterFormData: () => void;
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
    rechargeOnRest: 'long',
  });
};

const addConsumer = () => {
  localCharacterFormData.value.consumers!.push({
    cost: 1,
    name: '',
    resource: localCharacterFormData.value.resources![0].name,
  });
};

const addRecharger = () => {
  localCharacterFormData.value.specialRechargers!.push({
    name: '',
    rechargeCount: 1,
    resourceRecharged: localCharacterFormData.value.resources![0].name,
    resourceUsed: localCharacterFormData.value.resources![1].name,
    usedCount: 1,
  });
};

const deleteResource = (index: number) => {
  localCharacterFormData.value.resources!.splice(index, 1);
};

const deleteConsumer = (index: number) => {
  localCharacterFormData.value.consumers!.splice(index, 1);
};

const deleteRecharger = (index: number) => {
  localCharacterFormData.value.specialRechargers!.splice(index, 1);
};

useTitle('Edit ' + originalCharacterName + ' - DnD Resource Tracker');
</script>
<template>
  <form @submit.prevent="saveCharData">
    <section>
      <label>Name: <input type="text" v-model="localCharacterFormData.name" /></label>
      <label>AC: <input type="text" v-model="localCharacterFormData.armorClass" /></label>
      <label>Max HP: <input type="text" v-model="localCharacterFormData.maxHP" /></label>
      <label>Current HP: <input type="text" v-model="localCharacterFormData.currentHP" /></label>
      <label>Perception: <input type="text" v-model="localCharacterFormData.passivePerception" /></label>
    </section>
    <section>
      <div class="help-text">Drag and drop at the handle to reorder</div>
      <VueDraggable ref="resource-ref" v-model="localCharacterFormData.resources!" handle=".handle" :animation="150">
        <div class="resource-element" v-for="(resource, index) in localCharacterFormData.resources!" :key="index">
          <DragAndDropHandle />
          <div>
            <label>Resource Name: <input type="text" v-model="resource.name" /></label>
            <label>Max: <input type="number" min="1" v-model="resource.max" /></label>
            <label>Current: <input type="number" min="0" :max="resource.max" v-model="resource.current" /></label>
            <label
              >Recharge on:
              <select v-model="resource.rechargeOnRest">
                <option value="short">Short Rest</option>
                <option value="long">Long Rest</option>
              </select>
            </label>
            <label
              >Display as:
              <select v-model="resource.display">
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
    <section>
      <div class="help-text">Drag and drop at the handle to reorder</div>
      <VueDraggable ref="consumer-ref" v-model="localCharacterFormData.consumers!" :animation="150" handle=".handle">
        <div class="resource-element" v-for="(consumer, index) in localCharacterFormData.consumers!" :key="index">
          <DragAndDropHandle />
          <div>
            <label>Consumer Name: <input type="text" v-model="consumer.name" /></label>
            <label
              >Used resource:
              <select v-model="consumer.resource">
                <option
                  v-for="(resource, index) in localCharacterFormData.resources!"
                  :value="resource.name"
                  :key="index"
                >
                  {{ resource.name }}
                </option>
              </select>
            </label>
            <label>Cost: <input type="number" min="1" v-model="consumer.cost" /></label>
            <div>
              <button @click.prevent="() => deleteConsumer(index)">Delete</button>
            </div>
          </div>
        </div>
      </VueDraggable>
      <button @click.prevent="() => addConsumer()" v-if="localCharacterFormData.resources!.length > 0">
        Add consumer
      </button>
      <template v-else>
        <div class="error-text">You need to add at least one resource!</div>
      </template>
    </section>
    <section>
      <div class="help-text">Drag and drop at the handle to reorder</div>
      <VueDraggable
        ref="recharger-ref"
        v-model="localCharacterFormData.specialRechargers!"
        :animation="150"
        handle=".handle"
      >
        <div
          class="resource-element"
          v-for="(recharger, index) in localCharacterFormData.specialRechargers!"
          :key="index"
        >
          <DragAndDropHandle />
          <div>
            <label>Recharger Name: <input type="text" v-model="recharger.name" /></label>
            <label
              >Used resource:
              <select v-model="recharger.resourceUsed">
                <option
                  v-for="(resource, index) in localCharacterFormData.resources!"
                  :value="resource.name"
                  :key="index"
                >
                  {{ resource.name }}
                </option>
              </select>
            </label>
            <label>Cost: <input type="number" min="0" v-model="recharger.usedCount" /></label>
            <label
              >Recharged resource:
              <select v-model="recharger.resourceRecharged">
                <option
                  v-for="(resource, index) in localCharacterFormData.resources!"
                  :value="resource.name"
                  :key="index"
                >
                  {{ resource.name }}
                </option>
              </select>
            </label>
            <label>Amount recharged: <input type="number" min="1" v-model="recharger.rechargeCount" /></label>
            <div>
              <button @click.prevent="() => deleteRecharger(index)">Delete</button>
            </div>
          </div>
        </div>
      </VueDraggable>
      <button @click.prevent="() => addRecharger()" v-if="localCharacterFormData.resources!.length > 1">
        Add recharger
      </button>
      <template v-else>
        <div class="error-text">You need to add at least two resources (one to recharge, one to use)!</div>
      </template>
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
  align-items: center;

  > * {
    margin-right: 1rem;
  }
}

.help-text {
  font-size: 0.75rem;
  margin: 0.5rem 0;
}

.error-text {
  padding: 1rem;
  border: 2px solid darkred;
  color: darkred;
  background-color: #ffbbbb;
}
</style>
