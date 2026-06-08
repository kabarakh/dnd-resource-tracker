import type { Store } from 'pinia';

const up = (store: Store): Store => {
  return {
    ...store,
    version: 2
  }
}

export {up};
