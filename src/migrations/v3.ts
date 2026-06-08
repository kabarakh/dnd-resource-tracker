import type { Store } from 'pinia';
import { cloneDeep, forEach, map } from 'lodash';
import type { Character } from '@/interfaces/interfaces.ts';

const up = (store: Store): Store => {
  const newStore = cloneDeep(store);
  forEach(newStore.characters, (character: Character, name: string) => {
    newStore.characters[name] = {
      ...character,
      consumableInventory: []
    }
  });

  return newStore
}

export {up};
