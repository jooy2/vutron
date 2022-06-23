import { createI18n } from 'vue-i18n'
import en from '../../locales/en.json'

// eslint-disable-next-line new-cap
export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en
  }
})
