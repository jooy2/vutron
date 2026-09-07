import {
  createI18n,
  type LocaleMessageValue,
  type VueMessageType
} from 'vue-i18n'

// `vue-i18n` re-exports the value type but not the record it sits in
type LocaleMessages = Record<string, LocaleMessageValue<VueMessageType>>
import { FALLBACK_LOCALE, type SupportedLocale } from '@/common/locales'
import { getCurrentLocale } from '@/renderer/utils'

/*
 * Every JSON file in `renderer/locales` is registered under its own file name,
 * so adding a language means adding the file and its key to
 * `SUPPORTED_LOCALES`. Nothing here has to be edited.
 *
 * `eager` puts them in the main chunk. The eleven together are a few kilobytes,
 * less than what fetching one on demand would cost.
 * */
const localeModules = import.meta.glob<{ default: LocaleMessages }>(
  '@/renderer/locales/*.json',
  { eager: true }
)

const messages = Object.fromEntries(
  Object.entries(localeModules).map(([path, localeModule]) => [
    /([^/]+)\.json$/.exec(path)?.[1],
    localeModule.default
  ])
) as Record<SupportedLocale, LocaleMessages>

export default createI18n({
  locale: getCurrentLocale(),
  fallbackLocale: FALLBACK_LOCALE,
  globalInjection: true,
  silentTranslationWarn: process.env.NODE_ENV !== 'development',
  messages
})
