export default class Utils {
  static getCurrentLocale () {
    return navigator?.language?.split('-')[0] || 'en'
  }
}
