export default class TestUtil {
  constructor(page, testInfo, testScreenshotPath) {
    this._page = page
    this._testInfo = testInfo
    this._testScreenshotPath = testScreenshotPath
  }

  async captureScreenshot(pageInstance, screenshotName) {
    if (!pageInstance) {
      return
    }

    try {
      const screenshotPath = `${this._testScreenshotPath}/${screenshotName || `unknown_${Date.now()}`}.png`

      await pageInstance.screenshot({ path: screenshotPath })
    } catch (error) {
      // Do nothing
    }
  }

  async onTestError(error) {
    const titleLists = [...this._testInfo.titlePath]
    titleLists.shift()
    const title = titleLists.join('-')

    await this.captureScreenshot(this._page, `${title}_${Date.now()}`)

    return new Error(error)
  }
}
