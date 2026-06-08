import { forEach } from 'lodash';
import type { Store } from 'pinia';

const migrations = import.meta.glob('../migrations/*', {eager: true});
const CURRENT_VERSION = Object.keys(migrations).length + 1;

interface Migration {
  up: (store: T) => T;
}

const migrateStore = (store: Store): Store => {
  forEach(migrations, (migration, identifier) => {
    const filename = identifier.split('/').reverse()[0];
    const versionNumber = parseInt(filename.split('.')[0].slice(1));
    if ((store.version ?? 0) < versionNumber) {
      store = (migration as Migration).up(store)
    }
  })
  store.version = CURRENT_VERSION
  return store
};

export {
  CURRENT_VERSION,
  migrateStore
}
