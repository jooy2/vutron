import { test, expect, beforeAll, afterAll } from '../fixtures.mjs'

test.beforeAll(beforeAll)
test.afterAll(afterAll)

test('Document element check', async ({ page, util }) => {
  try {
    await expect(
      page.getByTestId('main-logo').first(),
      `Confirm main logo is visible`
    ).toBeVisible()
    await expect(
      page.getByTestId('select-language').first(),
      `Confirm language selector is visible`
    ).toBeVisible()

    await util.captureScreenshot(page, 'result')
  } catch (error) {
    throw await util.onTestError(error)
  }
})

test('Counter button click check', async ({ page, util }) => {
  try {
    await page.getByTestId('btn-counter').click({ clickCount: 10, delay: 50 })

    const counterValueElement = await page
      .getByTestId('counter-badge')
      .getByRole('status')
      .innerHTML()

    expect(counterValueElement).toBe('10')
  } catch (error) {
    throw await util.onTestError(error)
  }
})

// The preload bridge must hand a listener the payload only. Passing the
// `IpcRendererEvent` along would give the renderer `event.sender`, the whole
// `ipcRenderer`, and with it every channel the whitelists exist to block.
test('Main process event carries no IPC sender', async ({
  page,
  electronApp,
  util
}) => {
  try {
    // Registered before the message is sent, and read back afterwards, so the
    // listener cannot miss a broadcast that arrives while it is being set up.
    await page.evaluate(() => {
      window.ipcProbe = new Promise((resolve) => {
        window.mainApi.once('msgWindowsUpdated', (...args: unknown[]) => {
          resolve(args)
        })
      })
    })

    await electronApp.evaluate(({ BrowserWindow }) => {
      BrowserWindow.getAllWindows()[0].webContents.send(
        'msgWindowsUpdated',
        [1, 2]
      )
    })

    expect(await page.evaluate(() => window.ipcProbe)).toEqual([[1, 2]])
  } catch (error) {
    throw await util.onTestError(error)
  }
})

declare global {
  interface Window {
    // Set by the test above, inside the renderer
    ipcProbe: Promise<unknown[]>
  }
}
