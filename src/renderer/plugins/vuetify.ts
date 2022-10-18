import { createVuetify } from 'vuetify/dist/vuetify'
import { ko, en } from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

import colors from 'vuetify/lib/util/colors.mjs'

export default createVuetify({
  locale: {
    messages: { ko, en },
    defaultLocale: 'en',
    fallbackLocale: 'en'
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
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
