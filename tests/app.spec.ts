import { Page, _electron as electron } from 'playwright'
import { ElectronApplication } from 'playwright-core'
import { test, expect } from '@playwright/test'

let appWindow: Page
let appElectron: ElectronApplication

function waiting(milliseconds: number) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

function isElementVisible(selector: string, waitingMilliseconds = 100) {
  return new Promise((resolve) => {
    setTimeout(async () => {
      await expect(
        appWindow.locator(selector).first(),
        `Confirm selector '${selector}' is visible`
      ).toBeVisible()
      resolve(true)
    }, waitingMilliseconds)
  })
}

test.beforeAll(async () => {
  // Open Electron app from build directory
  appElectron = await electron.launch({ args: ['dist/main/index.js'] })
  appWindow = await appElectron.firstWindow()

  await appWindow.waitForEvent('load')
})

test('Environment check', async () => {
  const isPackaged = await appElectron.evaluate(async ({ app }) => {
    return app.isPackaged
  })

  expect(isPackaged, 'Confirm that is in development mode').toBe(false)
})

test('Document element check', async () => {
  await isElementVisible('.v-toolbar__content')
  await isElementVisible('#main-logo')
  await isElementVisible('#select-language')
})

test('Counter button click check', async () => {
  await appWindow.getByTestId('btn-counter').click({ clickCount: 10, delay: 50 })

  const counterValueElement = await appWindow
    .getByTestId('counter-badge')
    .getByRole('status')
    .innerHTML()

  expect(counterValueElement).toBe('10')
})

test.afterAll(async () => {
  await waiting(2000)
  await appElectron.close()
})
