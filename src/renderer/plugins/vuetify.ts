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
import { FALLBACK_LOCALE, type SupportedLocale } from '@/common/locales'
import { getCurrentLocale } from '@/renderer/utils'

/*
 * Vuetify has its own strings for the text inside its components, and it does
 * not follow `vue-i18n`. They are named exports, so unlike the message files in
 * `plugins/i18n.ts` they cannot be picked up by a glob and have to be listed.
 *
 * Typing the map against `SupportedLocale` is what keeps the two in step: a
 * language added to `SUPPORTED_LOCALES` and forgotten here fails the build.
 * */
const messages: Record<SupportedLocale, typeof en> = {
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
}

export default createVuetify({
  locale: {
    messages,
    locale: getCurrentLocale(),
    fallback: FALLBACK_LOCALE
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
