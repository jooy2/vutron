import { createApp } from 'vue'
import log from 'electron-log/renderer'

import App from '@/renderer/App.vue'
import router from '@/renderer/router'
import vuetify from '@/renderer/plugins/vuetify'
import i18n from '@/renderer/plugins/i18n'
import pinia from '@/renderer/plugins/pinia'

// The `window.mainApi` type is declared in `src/mainApi.d.ts`, shared with the
// preload script that actually exposes it.

const app = createApp(App)

// Vue swallows errors thrown inside components by default, which makes them
// invisible in a packaged app. Route them to the shared log file instead.
app.config.errorHandler = (err, instance, info): void => {
  log.error(`Unhandled error in ${info}:`, err)
}

window.addEventListener('unhandledrejection', (event): void => {
  log.error('Unhandled promise rejection:', event.reason)
})

app.use(vuetify).use(i18n).use(router).use(pinia)

app.mount('#app')
