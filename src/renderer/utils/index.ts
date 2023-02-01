export default class Utils {
  static getCurrentLocale(): string {
    return navigator?.language?.split('-')[0] || 'en'
  }

  static async openExternal(url: string): Promise<void> {
    await window.mainApi.openExternal(url)
  }
}

export const { getCurrentLocale, openExternal } = Utils
