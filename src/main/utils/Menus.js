import { systemPreferences } from 'electron'
import Constants from './Constants'

export default class Menus {
  static macOSDisableDefaultMenuItem () {
    if (Constants.IS_MAC) {
      systemPreferences.setUserDefault('NSDisabledDictationMenuItem', 'boolean', true)
      systemPreferences.setUserDefault('NSDisabledCharacterPaletteMenuItem', 'boolean', true)
    }
  }
}
