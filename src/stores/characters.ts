import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import type { Character, Resource } from '@/interfaces/interfaces';

export const useCharactersStore = defineStore('characters', () => {
  const characters = ref<Record<string, Character>>({});

  const changeCurrentHp = (charName: string, hpChange: number) => {
    const currentChar = characters.value[charName]!;
    let newHp = currentChar.currentHP + hpChange;
    if (newHp < 0) {
      newHp = 0;
    } else if (newHp > currentChar.maxHP) {
      newHp = currentChar.maxHP;
    }
    addOrEditCharacter(charName, { currentHP: newHp });
  };

  const addOrEditCharacter = (charName: string, data: Partial<Character>) => {
    let characterData: Character;

    if (findCharacterByName(charName) !== undefined) {
      characterData = characters.value[charName];
      characterData = { ...characterData, ...data };
    } else {
      characterData = {
        name: charName,
        armorClass: 0,
        consumers: [
          {
            name: 'Spell Level 1',
            cost: 1,
            resource: 'Spell Level 1',
          },
          {
            name: 'Spell Level 2',
            cost: 1,
            resource: 'Spell Level 2',
          },
        ],
        currentHP: 20,
        maxHP: 20,
        passivePerception: 0,
        resources: [
          {
            name: 'Sorcery Points',
            current: 3,
            max: 3,
            display: 'dots',
            rechargeOnRest: 'long',
          },
          {
            current: 4,
            max: 4,
            name: 'Spell Level 1',
            rechargeOnRest: 'long',
            display: 'dots',
          },
          {
            current: 2,
            max: 2,
            name: 'Spell Level 2',
            rechargeOnRest: 'long',
            display: 'dots',
          },
        ],
        specialRechargers: [
          {
            name: 'Font of Magic Level 1',
            rechargeCount: 1,
            resourceRecharged: 'Spell Level 1',
            resourceUsed: 'Sorcery Points',
            usedCount: 2,
          },
          {
            name: 'Font of Magic Level 2',
            rechargeCount: 1,
            resourceRecharged: 'Spell Level 2',
            resourceUsed: 'Sorcery Points',
            usedCount: 3,
          },
          {
            name: 'Recharge Sorcery Points from Level 1',
            rechargeCount: 2,
            resourceUsed: 'Spell Level 1',
            resourceRecharged: 'Sorcery Points',
            usedCount: 1,
          },
          {
            name: 'Recharge Sorcery Points from Level 2',
            rechargeCount: 3,
            resourceUsed: 'Spell Level 2',
            resourceRecharged: 'Sorcery Points',
            usedCount: 1,
          },
        ],
        ...data,
      };
    }

    const newCharacters = { ...characters.value };

    if (data.name !== undefined && charName !== data.name) {
      delete newCharacters[charName];
      characters.value = {
        ...newCharacters,
        [data.name]: characterData,
      };
    } else {
      characters.value = {
        ...newCharacters,
        [charName]: characterData,
      };
    }
  };

  const removeCharacter = (charName: string) => {
    if (findCharacterByName(charName) !== undefined) {
      const newCharacterData = { ...characters.value };
      delete newCharacterData[charName];
      characters.value = { ...newCharacterData };
    }
  };

  const useSpecialRecharger = (charName: string, specialRechargerName: string) => {
    if (findCharacterByName(charName) !== undefined) {
      const newCharacterData = { ...characters.value };
      const newCharacter = newCharacterData[charName];
      newCharacter.specialRechargers.forEach((specialRecharger) => {
        if (specialRechargerName === specialRecharger.name) {
          const newResources = newCharacter.resources.map((resource) => {
            if (resource.name === specialRecharger.resourceRecharged) {
              if (specialRecharger.rechargeCount === 'max') {
                resource.current = resource.max;
              } else {
                const newAmount = resource.current + specialRecharger.rechargeCount;
                resource.current = newAmount > resource.max ? resource.max : newAmount;
              }
            } else if (resource.name === specialRecharger.resourceUsed) {
              const newAmount = resource.current - specialRecharger.usedCount!;
              resource.current = newAmount < 0 ? 0 : newAmount;
            }
            return resource;
          });
          newCharacter.resources = [...newResources];
          characters.value = {
            ...newCharacterData,
            [charName]: newCharacter,
          };
        }
      });
    }
  };

  const useConsumer = (charName: string, consumerName: string) => {
    if (findCharacterByName(charName) !== undefined) {
      const newCharacterData = { ...characters.value };
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
          characters.value = {
            ...newCharacterData,
            [charName]: newCharacter,
          };
        }
      });
    }
  };

  const rest = (charName: string, restType: 'short' | 'long') => {
    if (findCharacterByName(charName) !== undefined) {
      const newCharacterData = { ...characters.value };
      const newCharacter = newCharacterData[charName];
      const newResources = newCharacter.resources.map((resource: Resource) => {
        if (resource.rechargeOnRest === restType || restType === 'long') {
          resource.current = resource.max;
        }
        return resource;
      });
      newCharacter.resources = [...newResources];
      characters.value = {
        ...newCharacterData,
        [charName]: newCharacter,
      };
    }
  };

  const findCharacterByName = (charName: string) => characters.value[charName] || undefined;

  return {
    characters,
    changeCurrentHp,
    addOrEditCharacter,
    removeCharacter,
    useSpecialRecharger,
    useConsumer,
    rest,
    findCharacterByName,
  };
}, { persist: true });
