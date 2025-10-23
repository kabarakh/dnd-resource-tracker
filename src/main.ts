import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import { createI18n } from 'vue-i18n';

import en from './locale/en.json5';
import de from './locale/de.json5';

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const i18n = createI18n({
  locale: localStorage.getItem('locale') || 'en',
  legacy: false,
  messages: {
    en, de
  }
});

app.use(pinia);
app.use(i18n);

app.mount('#app');
