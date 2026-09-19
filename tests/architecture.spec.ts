import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const chapterPath = '/#/chapters/core-architecture'

async function finishSceneAnimations(page: Page) {
  await page.locator('.architecture-scene').evaluate((element) => {
    for (const animation of element.getAnimations({ subtree: true })) {
      animation.finish()
    }
  })
}

async function expectWaitingForSend(page: Page) {
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/4$`))
  await expect(page.getByTestId('bucky-balance')).toHaveText('100')
  await expect(page.getByTestId('ty-account-row')).toHaveCount(0)
  await expect(page.getByTestId('bucky-change')).toHaveCount(0)
  await expect(page.getByTestId('ty-change')).toHaveCount(0)
  await expect(page.getByTestId('request-packet')).toHaveCount(0)
  await expect(
    page.getByRole('button', { name: 'Send', exact: true }),
  ).toBeEnabled()
}

async function expectTransferred(page: Page) {
  await expect(page.getByTestId('bucky-balance-after')).toBeVisible()
  await expect(page.getByTestId('bucky-balance-after')).toHaveText('99')
  await expect(page.getByTestId('bucky-balance-before')).toBeHidden()
  await expect(page.getByTestId('ty-account-row')).toBeVisible()
  await expect(page.getByTestId('ty-balance')).toHaveText('1')
  await expect(page.getByTestId('bucky-change')).toHaveText('−1')
  await expect(page.getByTestId('ty-change')).toHaveText('+1')
  await expect(
    page.getByRole('button', { name: 'Send', exact: true }),
  ).toHaveAttribute('aria-disabled', 'true')
}

async function sendAndFinish(page: Page) {
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await finishSceneAnimations(page)
  await expectTransferred(page)
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`Send waits for activation and resets with Replay, slide re-entry, history, and reload (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await page.goto(`${chapterPath}/4`)
    await expectWaitingForSend(page)
    await expect(page.getByLabel('To', { exact: true })).toHaveValue('Ty')
    await expect(page.getByLabel('To', { exact: true })).toHaveJSProperty(
      'readOnly',
      true,
    )
    await expect(page.getByLabel('Amount', { exact: true })).toHaveValue('1')
    await expect(page.getByLabel('Amount', { exact: true })).toHaveJSProperty(
      'readOnly',
      true,
    )
    // Entering this slide must not run the request or settlement timeline.
    await page.waitForTimeout(2600)
    await expectWaitingForSend(page)
    await sendAndFinish(page)

    await page
      .getByRole('button', { name: 'Replay animation', exact: true })
      .click()
    await expectWaitingForSend(page)
    await sendAndFinish(page)

    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
    await expect(page).toHaveURL(new RegExp(`${chapterPath}/5$`))
    await expect(page.locator('.architecture-scene')).toContainText('Data only')
    await page.goBack()
    await expectWaitingForSend(page)
    await sendAndFinish(page)

    await page
      .getByRole('button', { name: 'Previous slide', exact: true })
      .click()
    await expect(page).toHaveURL(new RegExp(`${chapterPath}/3$`))
    await expect(page.getByTestId('bucky-balance')).toHaveText('100')
    await expect(page.getByTestId('bucky-phone')).toContainText('Connected')
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
    await expectWaitingForSend(page)
    await sendAndFinish(page)

    await page.reload()
    await expectWaitingForSend(page)
    if (reducedMotion === 'reduce') {
      expect(
        await page
          .locator('.architecture-scene')
          .evaluate(
            (element) => element.getAnimations({ subtree: true }).length,
          ),
      ).toBe(0)
    }
  })

  for (const key of ['Enter', 'Space']) {
    test(`${key} transfers once despite repeated keyboard and pointer activation (${reducedMotion})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion })
      await page.goto(`${chapterPath}/4`)
      await expectWaitingForSend(page)
      const send = page.getByRole('button', { name: 'Send', exact: true })
      await send.focus()
      await page.keyboard.press(key)
      await expect(send).toHaveAttribute('aria-disabled', 'true')
      await expect(page.getByTestId('request-packet')).toHaveCount(1)
      await expect(send).toBeFocused()

      // aria-disabled preserves focus, so handlers must reject activation.
      await page.keyboard.down(key)
      await page.keyboard.down(key)
      await page.keyboard.up(key)
      await send.click({ force: true })
      await expect(page.getByTestId('request-packet')).toHaveCount(1)
      await expectTransferred(page)
      await expect(page.getByTestId('request-packet')).toBeHidden()

      await send.click({ force: true })
      await send.press(key)
      await expectTransferred(page)
      await expect(page.getByTestId('ty-account-row')).toHaveCount(1)
      await expect(page).toHaveURL(new RegExp(`${chapterPath}/4$`))
    })
  }
}

test('fifteen architecture slides have direct routes, bounded navigation, keyboard shortcuts, and history without phase controls', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto(`${chapterPath}/1`)
  const previous = page.getByRole('button', {
    name: 'Previous slide',
    exact: true,
  })
  const next = page.getByRole('button', { name: 'Next slide', exact: true })
  const progress = page.getByRole('navigation', { name: 'Slide navigation' })
  const phaseControls = page.getByRole('region', {
    name: 'Animation phase controls',
  })
  const scene = page.locator('.architecture-scene')
  await expect(progress.getByRole('button')).toHaveCount(15)
  await expect(previous).toBeDisabled()
  await expect(phaseControls).toHaveCount(0)
  await expect(scene).toContainText('Bonsai Core')
  await expect(page.getByTestId('bucky-balance')).toHaveCount(0)
  await expect(page.getByTestId('bucky-phone')).toHaveCount(0)
  const serverPlacement = () =>
    scene.locator('.architecture-server').evaluate((server) => {
      const frame = server
        .closest('.architecture-scene')!
        .getBoundingClientRect()
      const box = server.getBoundingClientRect()
      return {
        x: (box.x - frame.x) / frame.width,
        y: (box.y - frame.y) / frame.height,
        width: box.width / frame.width,
        height: box.height / frame.height,
      }
    })
  const standalonePlacement = await serverPlacement()

  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/2$`))
  await expect(page.getByTestId('bucky-balance')).toHaveText('100')
  await expect(page.getByTestId('ty-account-row')).toHaveCount(0)
  await expect(page.getByTestId('bucky-phone')).toHaveCount(0)
  await expect(phaseControls).toHaveCount(0)

  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/3$`))
  await expect(page.getByTestId('bucky-phone')).toContainText('Connected')
  await expect(page.getByTestId('bucky-balance')).toHaveText('100')
  await expect(phaseControls).toHaveCount(0)
  await page.keyboard.press('ArrowRight')
  await expectWaitingForSend(page)
  await expect(phaseControls).toHaveCount(0)

  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/5$`))
  await expect(scene).toContainText('Coins only')
  await expect(scene).toContainText('Coins + data')
  await expect(scene).toContainText('Data only')
  await expect(phaseControls).toHaveCount(0)
  await page.reload()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/5$`))
  await expect(scene).toContainText('Data only')
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/6$`))
  await expect(page.getByTestId('messaging-demo')).toBeVisible()
  await expect(phaseControls).toHaveCount(0)
  await expect(next).toBeEnabled()
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/7$`))
  await expect(page.getByTestId('coins-data-demo')).toBeVisible()
  await expect(phaseControls).toHaveCount(0)
  await expect(next).toBeEnabled()
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/8$`))
  await expect(page.getByTestId('ping-pong-demo')).toBeVisible()
  await expect(phaseControls).toHaveCount(0)
  await expect(next).toBeEnabled()
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/9$`))
  await expect(scene).toContainText('Tuna Core')
  await expect(page.getByTestId('bucky-phone')).toHaveCount(0)
  await expect(phaseControls).toHaveCount(0)
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/10$`))
  await expect(page.getByTestId('guessing-game-demo')).toBeVisible()
  await expect(phaseControls).toHaveCount(0)
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/11$`))
  await expect(page.getByTestId('bitcoin-trade-demo')).toHaveAttribute(
    'data-mode',
    'buy',
  )
  await expect(phaseControls).toHaveCount(0)
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/12$`))
  await expect(page.getByTestId('bitcoin-trade-demo')).toHaveAttribute(
    'data-mode',
    'sell',
  )
  await expect(phaseControls).toHaveCount(0)
  await expect(next).toBeEnabled()
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/13$`))
  await expect(scene.getByText('Coffee Core', { exact: true })).toBeVisible()
  await expect(scene.getByRole('table')).toHaveCount(0)
  await expect(scene.locator('input, textarea, button')).toHaveCount(0)
  await expect(page.getByTestId('bucky-phone')).toHaveCount(0)
  const coffeePlacement = await serverPlacement()
  for (const axis of ['x', 'y', 'width', 'height'] as const) {
    expect(coffeePlacement[axis]).toBeCloseTo(standalonePlacement[axis], 3)
  }
  await expect(next).toBeEnabled()
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/14$`))
  await expect(page.getByTestId('native-trade-demo')).toBeVisible()
  await expect(phaseControls).toHaveCount(0)
  await expect(next).toBeEnabled()
  await next.click()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/15$`))
  await expect(page.getByTestId('bridge-demo')).toBeVisible()
  await expect(phaseControls).toHaveCount(0)
  await expect(next).toBeDisabled()
  await page.keyboard.press('ArrowRight')
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/15$`))

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/14$`))
  await expect(page.getByTestId('native-trade-demo')).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/13$`))
  await expect(scene.getByText('Coffee Core', { exact: true })).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/12$`))
  await expect(page.getByTestId('bitcoin-trade-demo')).toHaveAttribute(
    'data-mode',
    'sell',
  )

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/11$`))
  await expect(page.getByTestId('bitcoin-trade-demo')).toHaveAttribute(
    'data-mode',
    'buy',
  )
  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/10$`))
  await expect(page.getByTestId('guessing-game-demo')).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/9$`))
  await expect(scene).toContainText('Tuna Core')
  await expect(page.getByTestId('bucky-phone')).toHaveCount(0)
  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/8$`))
  await expect(page.getByTestId('ping-pong-demo')).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/7$`))
  await expect(page.getByTestId('coins-data-demo')).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/6$`))
  await expect(page.getByTestId('messaging-demo')).toBeVisible()

  await page.goBack()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/5$`))
  await expect(scene).toContainText('Data only')
  await page.goBack()
  await expectWaitingForSend(page)
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/5$`))
  await expect(scene).toContainText('Data only')
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/6$`))
  await expect(page.getByTestId('messaging-demo')).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/7$`))
  await expect(page.getByTestId('coins-data-demo')).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/8$`))
  await expect(page.getByTestId('ping-pong-demo')).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/9$`))
  await expect(scene).toContainText('Tuna Core')
  await expect(page.getByTestId('bucky-phone')).toHaveCount(0)
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/10$`))
  await expect(page.getByTestId('guessing-game-demo')).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/11$`))
  await expect(page.getByTestId('bitcoin-trade-demo')).toHaveAttribute(
    'data-mode',
    'buy',
  )
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/12$`))
  await expect(page.getByTestId('bitcoin-trade-demo')).toHaveAttribute(
    'data-mode',
    'sell',
  )
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/13$`))
  await expect(scene.getByText('Coffee Core', { exact: true })).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/14$`))
  await expect(page.getByTestId('native-trade-demo')).toBeVisible()
  await page.goForward()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/15$`))
  await expect(page.getByTestId('bridge-demo')).toBeVisible()
  await next.focus()
  await page.keyboard.press('Home')
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/1$`))
  await expect(previous).toBeDisabled()
  await page.keyboard.press('ArrowLeft')
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/1$`))
  await page.keyboard.press('End')
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/15$`))
})

test('Core waits for a clicked request and pause holds settlement', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.goto(`${chapterPath}/4`)
  await expectWaitingForSend(page)
  await page.getByRole('button', { name: 'Send', exact: true }).click()
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  const before = page.getByTestId('bucky-balance-before')
  const after = page.getByTestId('bucky-balance-after')
  const tyRow = page.getByTestId('ty-account-row')
  await expect(before).toBeVisible()
  await expect(before).toHaveText('100')
  await expect(after).toBeHidden()
  await expect(tyRow).toBeHidden()
  await page.waitForTimeout(2400)
  await expect(before).toBeVisible()
  await expect(tyRow).toBeHidden()
  await page
    .getByRole('button', { name: 'Resume animation', exact: true })
    .click()
  await expectTransferred(page)
  await expect(page.getByTestId('request-packet')).toBeHidden()
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/4$`))
})
