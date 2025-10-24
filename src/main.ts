import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createI18n } from 'vue-i18n';
import { forEach } from 'lodash';

import App from './App.vue';

const locales = import.meta.glob('./locale/*.json5', { eager: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: Record<string, any> = {};
forEach(locales, (content, identifier) => {
  const filename = identifier.split('/').reverse()[0];
  const langId = filename.split('.')[0];
  messages[langId] = content;
});

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'en',
  legacy: false,
  messages,
});

app.use(pinia);
app.use(i18n);

app.mount('#app');
