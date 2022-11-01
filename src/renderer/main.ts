import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from '@/renderer/App.vue'
import router from '@/renderer/router'
import vuetify from '@/renderer/plugins/vuetify'
import i18n from '@/renderer/plugins/i18n'

const app = createApp(App)

app.use(vuetify).use(i18n).use(router).use(createPinia())

app.mount('#app')
