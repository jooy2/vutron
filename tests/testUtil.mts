import { Page } from 'playwright'
import { TestInfo } from 'playwright/test'

export default class TestUtil {
  _page: Page

  _testInfo: TestInfo

  _testScreenshotPath: string

  constructor(page: Page, testInfo: TestInfo, testScreenshotPath: string) {
    this._page = page
    this._testInfo = testInfo
    this._testScreenshotPath = testScreenshotPath
  }

  async captureScreenshot(pageInstance: Page, screenshotName: string) {
    if (!pageInstance) {
      return
    }

    try {
      const screenshotPath = `${this._testScreenshotPath}/${screenshotName || `unknown_${Date.now()}`}.png`

      await pageInstance.screenshot({ path: screenshotPath })
    } catch {
      // Do nothing
    }
  }

  // A caught value is `unknown`, so what is thrown is not necessarily an
  // `Error`. Playwright needs one, and its message is what ends up in the
  // report.
  async onTestError(error: unknown) {
    const titleLists = [...this._testInfo.titlePath]
    titleLists.shift()
    const title = titleLists.join('-')

    await this.captureScreenshot(this._page, `${title}_${Date.now()}`)

    return new Error(error instanceof Error ? error.message : String(error))
  }
}
