import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'

import 'vuetify/dist/vuetify.min.css'

const app = createApp(App)

app
  .use(vuetify)
  .use(router)
  .use(createPinia())

app.mount('#app')
