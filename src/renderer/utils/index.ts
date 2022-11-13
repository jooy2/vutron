import { shell } from 'electron'

export default class Utils {
  static getCurrentLocale(): string {
    return navigator?.language?.split('-')[0] || 'en'
  }

  static async openExternal(url: string): Promise<void> {
    await shell.openExternal(url)
  }
}

export const { getCurrentLocale, openExternal } = Utils
