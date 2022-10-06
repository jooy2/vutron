import { shell } from 'electron'

export default class Utils {
  static getCurrentLocale () {
    return navigator?.language?.split('-')[0] || 'en'
  }

  static async openExternal (url) {
    await shell.openExternal(url)
  }
}
