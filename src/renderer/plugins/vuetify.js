import { createVuetify } from 'vuetify/dist/vuetify'
import { ko, en } from 'vuetify/locale'

export default createVuetify({
  icons: {
    iconfont: 'mdi'
  },
  locale: {
    messages: { ko, en },
    defaultLocale: 'en',
    fallbackLocale: 'en'
  }
})
