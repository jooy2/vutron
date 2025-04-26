import { test, expect, beforeAll, afterAll } from '../fixtures.mjs'

test.beforeAll(beforeAll)
test.afterAll(afterAll)

// @ts-ignore
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

// @ts-ignore
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
