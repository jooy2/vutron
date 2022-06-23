import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'

import 'vuetify/dist/vuetify.min.css'
import i18n from './plugins/i18n'

const app = createApp(App)

app
  .use(vuetify)
  .use(i18n)
  .use(router)
  .use(createPinia())

app.mount('#app')
