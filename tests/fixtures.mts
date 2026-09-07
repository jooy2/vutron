import * as base from '@playwright/test'
import { _electron as electron, Page, ElectronApplication } from 'playwright'
import { join } from 'path'
import { main } from '../package.json'
import TestUtil from './testUtil.mjs'

let appElectron: ElectronApplication
let page: Page

const __cwd = process.cwd()
const __isCiProcess = process.env.CI === 'true'
const __testPath = join(__cwd, 'tests')
const __testResultPath = join(__testPath, 'results')
const __testScreenshotPath = join(__testResultPath, 'screenshots')

export const beforeAll = async () => {
  // Open Electron app from build directory
  appElectron = await electron.launch({
    args: [
      main,
      ...(__isCiProcess ? ['--no-sandbox'] : []),
      '--enable-logging',
      '--ignore-certificate-errors',
      '--ignore-ssl-errors',
      '--ignore-blocklist',
      '--ignore-gpu-blocklist'
    ],
    locale: 'en-US',
    colorScheme: 'light',
    env: {
      ...process.env,
      NODE_ENV: 'production'
    }
  })
  page = await appElectron.firstWindow()

  await page.waitForEvent('load')

  page.on('console', console.log)
  page.on('pageerror', console.log)

  const browserWindow = await appElectron.browserWindow(page)
  await browserWindow.evaluate((currentWindow) => {
    currentWindow.setPosition(50, 50)
    currentWindow.setSize(1080, 560)
  })

  const evaluateResult = await appElectron.evaluate(async ({ app }) => {
    return {
      packaged: app.isPackaged,
      dataPath: app.getPath('userData')
    }
  })

  base.expect(evaluateResult.packaged, 'app is not packaged').toBe(false)
}

export const afterAll = async () => {
  await appElectron.close()
}

/*
 * Fixtures on top of the ones Playwright provides. Declaring them here is what
 * lets a spec destructure `electronApp` and `util` with types rather than a
 * `@ts-expect-error` on every test.
 * */
export interface TestFixtures {
  // The Electron main process, for tests that have to act on it directly
  electronApp: ElectronApplication
  util: TestUtil
}

export const test = base.test.extend<TestFixtures>({
  // eslint-disable-next-line no-empty-pattern
  page: async ({}, use) => {
    await use(page)
  },
  // eslint-disable-next-line no-empty-pattern
  electronApp: async ({}, use) => {
    await use(appElectron)
  },
  util: async ({ page }, use, testInfo) => {
    await use(new TestUtil(page, testInfo, __testScreenshotPath))
  }
})

export const expect = base.expect

export default {
  test,
  expect,
  beforeAll,
  afterAll
}
