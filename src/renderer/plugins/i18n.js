import { createI18n } from 'vue-i18n'
import en from '@/renderer/locales/en.json'
import ko from '@/renderer/locales/ko.json'
import Utils from '@/renderer/utils'

export default createI18n({
  legacy: false,
  locale: Utils.getCurrentLocale(),
  fallbackLocale: 'en',
  globalInjection: true,
  messages: {
    en,
    ko
  }
})
