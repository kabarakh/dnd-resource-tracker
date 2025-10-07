import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Character } from '@/interfaces/interfaces';

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
          consumers: [],
          currentHP: 100,
          maxHP: 100,
          passivePerception: 0,
          resources: [
            {
              current: 10,
              max: 10,
              name: 'KI Points',
              rechargeOnRest: 'long',
            },
            {
              current: 3,
              max: 3,
              name: 'Chronocharm',
              rechargeOnRest: 'long',
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
  },
  getters: {
    findCharacterByName: (state) => {
      return (charName: string) => state.characters[charName] || undefined;
    },
  },
  persist: true,
});
