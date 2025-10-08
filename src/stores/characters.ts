import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Character, Resource } from '@/interfaces/interfaces';

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});

export const useCharactersStore = defineStore('characters', {
  state: (): {
    characters: {
      [name: string]: Character;
    };
  } => ({
    characters: {},
  }),
  actions: {
    changeCurrentHp(charName: string, hpChange: number) {
      const currentChar = this.characters[charName]!;
      let newHp = currentChar.currentHP + hpChange;
      if (newHp < 0) {
        newHp = 0;
      } else if (newHp > currentChar.maxHP) {
        newHp = currentChar.maxHP;
      }
      this.addOrEditCharacter(charName, { currentHP: newHp });
    },
    addOrEditCharacter(charName: string, data: Partial<Character>) {
      let characterData: Character;

      if (this.characters[charName] !== undefined) {
        characterData = this.characters[charName];
        characterData = { ...characterData, ...data };
      } else {
        characterData = {
          name: charName,
          armorClass: 0,
          consumers: [
            {
              name: 'Stealth',
              cost: 1,
              resource: 'KI Points',
            },
            {
              name: 'Chronocharm',
              cost: 1,
              resource: 'Chronocharm',
            },
          ],
          currentHP: 100,
          maxHP: 100,
          passivePerception: 0,
          resources: [
            {
              current: 2,
              max: 10,
              name: 'KI Points',
              rechargeOnRest: 'long',
              display: 'bar',
            },
            {
              current: 1,
              max: 3,
              name: 'Chronocharm',
              rechargeOnRest: 'short',
              display: 'dots',
            },
          ],
          specialRechargers: [],
          ...data,
        };
      }

      const newCharacters = { ...this.characters };

      if (data.name !== undefined && charName !== data.name) {
        delete newCharacters[charName];
        this.characters = {
          ...newCharacters,
          [data.name]: characterData,
        };
      } else {
        this.characters = {
          ...newCharacters,
          [charName]: characterData,
        };
      }
    },
    removeCharacter(charName: string) {
      if (this.characters[charName] !== undefined) {
        const newCharacterData = { ...this.characters };
        delete newCharacterData[charName];
        this.characters = { ...newCharacterData };
      }
    },
    useConsumer(charName: string, consumerName: string) {
      if (this.characters[charName] !== undefined) {
        const newCharacterData = { ...this.characters };
        const newCharacter = newCharacterData[charName];

        newCharacter.consumers.forEach((consumer) => {
          if (consumer.name === consumerName) {
            const newResources = newCharacter.resources.map((resource) => {
              if (resource.name === consumer.resource) {
                const newAmount = resource.current - consumer.cost;
                resource.current = newAmount < 0 ? 0 : newAmount;
              }
              return resource;
            });
            newCharacter.resources = [...newResources];
            this.characters = {
              ...newCharacterData,
              [charName]: newCharacter,
            };
          }
        });
      }
    },
    rest(charName: string, restType: 'short' | 'long') {
      if (this.characters[charName] !== undefined) {
        const newCharacterData = { ...this.characters };
        const newCharacter = newCharacterData[charName];
        const newResources = newCharacter.resources.map((resource: Resource) => {
          if (resource.rechargeOnRest === restType || restType === 'long') {
            resource.current = resource.max;
          }
          return resource;
        });
        newCharacter.resources = [...newResources];
        this.characters = {
          ...newCharacterData,
          [charName]: newCharacter,
        };
      }
    },
  },
  getters: {
    findCharacterByName: (state) => {
      return (charName: string) => state.characters[charName] || undefined;
    },
  },
  persist: true,
});
