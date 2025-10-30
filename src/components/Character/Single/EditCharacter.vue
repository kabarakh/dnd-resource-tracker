<script setup lang="ts">
import { useTitle } from '@vueuse/core';
import { cloneDeep } from 'lodash';
import { ref, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import { useI18n } from 'vue-i18n'

import DragAndDropHandle from '@/components/Buttons/DragAndDropHandle.vue';
import ResourceBar from '@/components/Resources/ResourceBar.vue';
import ResourceDots from '@/components/Resources/ResourceDots.vue';

import type { Character } from '@/interfaces/interfaces';
import { useCharactersStore } from '@/stores/characters';

const { t, locale } = useI18n()
const charactersStore = useCharactersStore();

const { characterFormData, originalCharacterName, resetCharacterFormData } = defineProps<{
  characterFormData: Partial<Character>;
  originalCharacterName: string;
  resetCharacterFormData: () => void;
}>();

const localCharacterFormData = ref(cloneDeep(characterFormData));

watch(locale, () => {
  useTitle(t('app.editCharacter', { character: originalCharacterName }) + ' - DnD Resource Tracker');
}, {
  immediate: true
})

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

const canResourceBeDeleted = (resourceName: string): boolean => {
  const rechargersUsingResource = localCharacterFormData.value.specialRechargers?.find((recharger) => { return recharger.resourceUsed === resourceName });
  const rechargersRecharginingResource = localCharacterFormData.value.specialRechargers?.find((recharger) => { return recharger.resourceRecharged === resourceName });
  const consumerUsingResource = localCharacterFormData.value.consumers?.find((consumer) => { return consumer.resource === resourceName });

  return rechargersRecharginingResource === undefined && rechargersUsingResource === undefined && consumerUsingResource === undefined;
}

</script>
<template>
  <form @submit.prevent="saveCharData">
    <section>
      <label>{{ t('character.name') }}: <input type="text" v-model="localCharacterFormData.name" /></label>
      <label>{{ t('character.ac') }}: <input type="number" v-model="localCharacterFormData.armorClass" /></label>
      <label>{{ t('character.maxHp') }}: <input type="number" v-model="localCharacterFormData.maxHP" /></label>
      <label>{{ t('character.currentHp') }}: <input type="number" v-model="localCharacterFormData.currentHP" /></label>
      <label>
        {{ t('character.perception') }}:
        <input type="number" v-model="localCharacterFormData.passivePerception" />
      </label>
    </section>
    <section>
      <div class="help-text">{{ t('app.help.dragNDrop') }}</div>
      <VueDraggable ref="resource-ref" v-model="localCharacterFormData.resources!" handle=".handle" :animation="150">
        <div class="resource-element" v-for="(resource, index) in localCharacterFormData.resources!" :key="index">
          <DragAndDropHandle />
          <div>
            <label>{{ t('resource.name') }}: <input type="text" v-model="resource.name" /></label>
            <label>{{ t('base.max') }}: <input type="number" min="1" v-model="resource.max" /></label>
            <label>
              {{ t('base.current') }}:
              <input type="number" min="0" :max="resource.max" v-model="resource.current" />
            </label>
            <label>{{ t('resource.rechargeOn') }}:
              <select v-model="resource.rechargeOnRest">
                <option value="short">{{ t('rest.short') }}</option>
                <option value="long">{{ t('rest.long') }}</option>
              </select>
            </label>
            <label>{{ t('resource.displayAs') }}:
              <select v-model="resource.display">
                <option value="dots">{{ t('app.dots') }}</option>
                <option value="bar">{{ t('app.bar') }}</option>
              </select>
            </label>
            <div>
              <button :disabled="!canResourceBeDeleted(resource.name)" @click.prevent="() => deleteResource(index)">
                {{ t('app.delete') }}
              </button>
              <div class="error-text" v-if="!canResourceBeDeleted(resource.name)">
                {{ t('errors.resource.inUse') }}
              </div>
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
      <button @click.prevent="() => addResource()">{{ t('resource.add') }}</button>
    </section>
    <section>
      <div class="help-text">{{ t('app.help.dragNDrop') }}</div>
      <VueDraggable ref="consumer-ref" v-model="localCharacterFormData.consumers!" :animation="150" handle=".handle">
        <div class="resource-element" v-for="(consumer, index) in localCharacterFormData.consumers!" :key="index">
          <DragAndDropHandle />
          <div>
            <label>{{ t('consumer.name') }}: <input type="text" v-model="consumer.name" /></label>
            <label>{{ t('consumer.usedResource') }}:
              <select v-model="consumer.resource">
                <option v-for="(resource, index) in localCharacterFormData.resources!" :value="resource.name"
                  :key="index">
                  {{ resource.name }}
                </option>
              </select>
            </label>
            <label>{{ t('consumer.cost') }}: <input type="number" min="1" v-model="consumer.cost" /></label>
            <div>
              <button @click.prevent="() => deleteConsumer(index)">
                {{ t('app.delete') }}
              </button>
            </div>
          </div>
        </div>
      </VueDraggable>
      <button @click.prevent="() => addConsumer()" v-if="localCharacterFormData.resources!.length > 0">
        {{ t('consumer.add') }}
      </button>
      <template v-else>
        <div class="error-text">{{ t('errors.consumer.notEnoughResources') }}</div>
      </template>
    </section>
    <section>
      <div class="help-text">{{ t('app.help.dragNDrop') }}</div>
      <VueDraggable ref="recharger-ref" v-model="localCharacterFormData.specialRechargers!" :animation="150"
        handle=".handle">
        <div class="resource-element" v-for="(recharger, index) in localCharacterFormData.specialRechargers!"
          :key="index">
          <DragAndDropHandle />
          <div>
            <label>{{ t('recharger.name') }}: <input type="text" v-model="recharger.name" /></label>
            <label>{{ t('recharger.usedResource') }}:
              <select v-model="recharger.resourceUsed">
                <option v-for="(resource, index) in localCharacterFormData.resources!" :value="resource.name"
                  :key="index">
                  {{ resource.name }}
                </option>
              </select>
            </label>
            <label>{{ t('recharger.cost') }}: <input type="number" min="0" v-model="recharger.usedCount" /></label>
            <label>{{ t('recharger.rechargedResource') }}:
              <select v-model="recharger.resourceRecharged">
                <option v-for="(resource, index) in localCharacterFormData.resources!" :value="resource.name"
                  :key="index">
                  {{ resource.name }}
                </option>
              </select>
            </label>
            <label>{{ t('recharger.rechargeCount') }}: <input type="number" min="1"
                v-model="recharger.rechargeCount" /></label>
            <div>
              <button @click.prevent="() => deleteRecharger(index)">
                {{ t('app.delete') }}
              </button>
            </div>
          </div>
        </div>
      </VueDraggable>
      <button @click.prevent="() => addRecharger()" v-if="localCharacterFormData.resources!.length > 1">
        {{ t('recharger.add') }}
      </button>
      <template v-else>
        <div class="error-text">{{ t('errors.recharger.notEnoughResources') }}</div>
      </template>
    </section>
    <button type="submit">{{ t('app.save') }}</button>
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

  >* {
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
