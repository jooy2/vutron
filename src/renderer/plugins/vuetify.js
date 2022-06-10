import { createVuetify } from 'vuetify/dist/vuetify'
import messages from './i18n'

const vuetify = createVuetify({
  icons: {
    iconfont: 'mdi'
  },
  locale: {
    defaultLocale: 'en',
    fallbackLocale: 'en',
    messages
  }
})

export default vuetify
