import { createVuetify } from 'vuetify/dist/vuetify'
import { ko, en } from 'vuetify/locale'

import colors from 'vuetify/lib/util/colors.mjs'

export default createVuetify({
  icons: {
    iconfont: 'mdi'
  },
  locale: {
    messages: { ko, en },
    defaultLocale: 'en',
    fallbackLocale: 'en'
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          primary: colors.green.darken2
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: colors.green.darken4
        }
      }
    }
  }
})
