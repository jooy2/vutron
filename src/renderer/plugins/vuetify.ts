import { createVuetify } from 'vuetify'
import {
  ko,
  en,
  zhHans,
  zhHant,
  de,
  es,
  ja,
  fr,
  ru,
  pt,
  nl
} from 'vuetify/locale'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import 'vuetify/styles'

import colors from 'vuetify/util/colors'
import { getCurrentLocale } from '@/renderer/utils'

export default createVuetify({
  // Keep this in sync with `plugins/i18n.ts`. Vuetify has its own locale for
  // the strings built into its components, and it does not follow `vue-i18n`.
  locale: {
    messages: { ko, en, zhHans, zhHant, de, es, ja, fr, ru, pt, nl },
    locale: getCurrentLocale(),
    fallback: 'en'
  },
  defaults: {
    VBtn: {
      style: [
        {
          // Do not force capitalization of a button text
          textTransform: 'none'
        }
      ]
    }
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
