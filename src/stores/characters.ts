import { ref } from 'vue';
import { defineStore } from 'pinia';
import type { Character, Resource } from '@/interfaces/interfaces';

export const useCharactersStore = defineStore(
  'characters',
  () => {
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
      const char = findCharacterByName(charName);
      if (char === undefined) {
        return;
      }

      const specialRecharger = findSpecialRecharger(charName, specialRechargerName);
      if (specialRecharger === undefined) {
        return;
      }

      // Recharge the target resource
      const target = findResource(charName, specialRecharger.resourceRecharged);
      if (target !== undefined) {
        if (specialRecharger.rechargeCount === 'max') {
          target.current = target.max;
        } else {
          const newAmount = target.current + specialRecharger.rechargeCount;
          target.current = newAmount > target.max ? target.max : newAmount;
        }
      }

      // Spend from the used resource if configured
      if (specialRecharger.resourceUsed !== undefined && specialRecharger.usedCount !== undefined) {
        const used = findResource(charName, specialRecharger.resourceUsed);
        if (used !== undefined) {
          const newAmount = used.current - specialRecharger.usedCount;
          used.current = newAmount < 0 ? 0 : newAmount;
        }
      }

      // Trigger reactivity
      characters.value = { ...characters.value };
    };

    const useConsumer = (charName: string, consumerName: string) => {
      const char = findCharacterByName(charName);
      if (char === undefined) {
        return;
      }

      const consumer = findConsumer(charName, consumerName);
      if (consumer === undefined) {
        return;
      }

      const resource = findResource(charName, consumer.resource);
      if (resource !== undefined) {
        const newAmount = resource.current - consumer.cost;
        resource.current = newAmount < 0 ? 0 : newAmount;
      }

      // Trigger reactivity
      characters.value = { ...characters.value };
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
        if (restType === 'long') {
          newCharacter.currentHP = newCharacter.maxHP;
        }
        newCharacter.resources = [...newResources];
        characters.value = {
          ...newCharacterData,
          [charName]: newCharacter,
        };
      }
    };

    const findCharacterByName = (charName: string) => {
      return characters.value[charName] ?? undefined;
    };

    const canConsumerBeUsed = (charName: string, consumerName: string) => {
      const consumer = findConsumer(charName, consumerName);
      if (consumer !== undefined) {
        const resource = findResource(charName, consumer.resource);
        if (resource !== undefined && resource.current >= consumer.cost) {
          return true;
        }
      }

      return false;
    };

    const canSpecialRechargerBeUsed = (charName: string, specialRechargerName: string) => {
      const specialRecharger = findSpecialRecharger(charName, specialRechargerName);
      if (specialRecharger !== undefined) {
        const resource = findResource(charName, specialRecharger.resourceUsed);
        if (resource !== undefined && resource.current >= specialRecharger.usedCount) {
          return true;
        }
      }

      return false;
    };

    // Internal helper finders (non-exported)
    const getCharacter = (charName: string) => {
      return characters.value[charName] ?? undefined;
    };
    const findResource = (charName: string, resourceName: string) => {
      return getCharacter(charName)?.resources.find((r) => {
        return r.name === resourceName;
      });
    };
    const findConsumer = (charName: string, consumerName: string) => {
      return getCharacter(charName)?.consumers.find((c) => {
        return c.name === consumerName;
      });
    };
    const findSpecialRecharger = (charName: string, specialRechargerName: string) => {
      return getCharacter(charName)?.specialRechargers.find((s) => {
        return s.name === specialRechargerName;
      });
    };

    return {
      characters,
      changeCurrentHp,
      addOrEditCharacter,
      removeCharacter,
      useSpecialRecharger,
      useConsumer,
      rest,
      findCharacterByName,
      canConsumerBeUsed,
      canSpecialRechargerBeUsed,
    };
  },
  { persist: true },
);
