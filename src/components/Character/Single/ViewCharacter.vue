<script setup lang="ts">
import { useCharactersStore } from '@/stores/characters';
import type { Character } from '@/interfaces/interfaces';
import { ref } from 'vue';
import RechargerButton from '@/components/Buttons/RechargerButton.vue';
import ConsumerButton from '@/components/Buttons/ConsumerButton.vue';
import ResourceBar from '@/components/Resources/ResourceBar.vue';
import ResourceDots from '@/components/Resources/ResourceDots.vue';
import { useTitle } from '@vueuse/core';

const charactersStore = useCharactersStore();
const { character } = defineProps<{ character: Character }>();
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const hpChange = ref(0);

useTitle(character.name + ' - DnD Resource Tracker');
</script>

<template>
  <section>
    <div>{{ t('character.name') }}: {{ character.name }}</div>
    <div>
      <ResourceBar :current="character.currentHP" :max="character.maxHP" :name="t('character.hp')" />
      <form @submit.prevent="
        () => {
          charactersStore.changeCurrentHp(character.name, hpChange);
        }
      ">
        <input type="number" v-model="hpChange" />
        <input type="submit" :value="t('character.changeHp')" />
      </form>
    </div>
    <div>{{ t('character.ac') }}: {{ character.armorClass }}</div>
    <div>{{ t('character.perception') }}: {{ character.passivePerception }}</div>
  </section>
  <section>
    <ul>
      <li v-for="(resource, index) in character.resources" :key="index">
        <template v-if="resource.display === 'dots'">
          <ResourceDots :current="resource.current" :max="resource.max" :name="resource.name" />
        </template>
        <template v-if="resource.display === 'bar'">
          <ResourceBar :current="resource.current" :max="resource.max" :name="resource.name" />
        </template>
      </li>
    </ul>
  </section>
  <section class="flex flex-row">
    <ConsumerButton v-for="(consumer, index) in character.consumers" :key="index" :characterName="character.name"
      :consumer="consumer" />
  </section>
  <section class="flex flex-row">
    <RechargerButton v-for="(recharger, index) in character.specialRechargers" :key="index"
      :characterName="character.name" :recharger="recharger" />
  </section>
  <section>
    <button @click.prevent="() => charactersStore.rest(character.name, 'short')">{{ t('rest.short') }}</button>
    <button @click.prevent="() => charactersStore.rest(character.name, 'long')">{{ t('rest.long') }}</button>
  </section>
</template>
