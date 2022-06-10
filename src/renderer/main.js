import { createApp } from 'vue'

import App from './App'
import router from './router'
import vuetify from './plugins/vuetify'
import 'vuetify/dist/vuetify.min.css'

const app = createApp(App)

app
  .use(vuetify)
  .use(router)

app.mount('#app')
