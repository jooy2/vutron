/*
 * Language keys and the tag matching that goes with them.
 *
 * Only the renderer displays translated strings today, but the locale the user
 * ended up with is app state, not screen state: a main process menu or dialog
 * has to land on the same one. The lookup is kept here as a pure function so
 * that both sides can call it, see `src/common/ipc.ts` for what may live here.
 * */

// Locale keys bundled in `renderer/locales`. Keep this in sync with the
// `messages` map in `renderer/plugins/i18n.ts` when adding a new language.
export const SUPPORTED_LOCALES: string[] = [
  'en',
  'ko',
  'zhHans',
  'zhHant',
  'de',
  'es',
  'ja',
  'fr',
  'ru',
  'pt',
  'nl'
]

export const FALLBACK_LOCALE = 'en'

// BCP 47 tags (`en-US`, `zh-Hans-CN`) do not map to the locale keys one-to-one.
// Chinese in particular is split by script rather than by region, so it cannot
// be derived from the tag alone.
const LOCALE_ALIASES: Record<string, string> = {
  zh: 'zhHans',
  'zh-cn': 'zhHans',
  'zh-sg': 'zhHans',
  'zh-hans': 'zhHans',
  'zh-tw': 'zhHant',
  'zh-hk': 'zhHant',
  'zh-mo': 'zhHant',
  'zh-hant': 'zhHant'
}

/*
 * Turns a BCP 47 language tag into one of `SUPPORTED_LOCALES`, falling back to
 * `FALLBACK_LOCALE` when nothing matches. Where the tag came from is up to the
 * caller: `navigator.language` in the renderer, `app.getLocale()` in the main
 * process.
 * */
export function resolveLocale(languageTag?: string | null): string {
  const language = languageTag?.toLowerCase()

  if (!language) {
    return FALLBACK_LOCALE
  }

  const segments = language.split('-')
  // `zh-hans-cn` -> [`zh-hans-cn`, `zh-hans`, `zh`], from most to least specific
  const candidates = [language, segments.slice(0, 2).join('-'), segments[0]]

  for (const candidate of candidates) {
    if (LOCALE_ALIASES[candidate]) {
      return LOCALE_ALIASES[candidate]
    }

    if (SUPPORTED_LOCALES.includes(candidate)) {
      return candidate
    }
  }

  return FALLBACK_LOCALE
}
