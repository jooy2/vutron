import path from 'path'
import Constants from './Constants'

export default class Utils {
  static getAppIcon () {
    return path.join(__static, Constants.APP_ICON)
  }
}
