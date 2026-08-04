// Locale keys bundled in `renderer/locales`. Keep this in sync with the
// `messages` map in `plugins/i18n.ts` when adding a new language.
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

// `navigator.language` returns BCP 47 tags (`en-US`, `zh-Hans-CN`) that do not
// map to the locale keys one-to-one. Chinese in particular is split by script
// rather than by region, so it cannot be derived from the tag alone.
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

export function getCurrentLocale(): string {
  const language = navigator?.language?.toLowerCase()

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

export async function openExternal(url: string): Promise<void> {
  await window.mainApi.send('msgOpenExternalLink', url)
}

export async function openFile(type: string): Promise<any> {
  return window.mainApi.invoke('msgOpenFile', type)
}
