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

const hpChange = ref(0);

useTitle(character.name + ' - DnD Resource Tracker');
</script>

<template>
  <section>
    <div>Name: {{ character.name }}</div>
    <div>
      <ResourceBar :current="character.currentHP" :max="character.maxHP" name="HP" />
      <form
        @submit.prevent="
          () => {
            charactersStore.changeCurrentHp(character.name, hpChange);
          }
        "
      >
        <input type="number" v-model="hpChange" />
        <input type="submit" value="Change HP" />
      </form>
    </div>
    <div>Armor Class: {{ character.armorClass }}</div>
    <div>Passive Perception: {{ character.passivePerception }}</div>
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
    <ConsumerButton
      v-for="(consumer, index) in character.consumers"
      :key="index"
      :characterName="character.name"
      :consumer="consumer"
    />
  </section>
  <section class="flex flex-row">
    <RechargerButton
      v-for="(recharger, index) in character.specialRechargers"
      :key="index"
      :characterName="character.name"
      :recharger="recharger"
    />
  </section>
  <section>
    <button @click.prevent="() => charactersStore.rest(character.name, 'short')">Short Rest</button>
    <button @click.prevent="() => charactersStore.rest(character.name, 'long')">Long Rest</button>
  </section>
</template>
