import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const chapterPath = '/#/chapters/core-architecture'
const legs = [
  'ping-to-core',
  'ping-to-program',
  'pong-to-core',
  'pong-to-phone',
] as const

function demo(page: Page) {
  return page.getByTestId('ping-pong-demo')
}

function sendButton(page: Page) {
  return demo(page).getByRole('button', { name: 'Send Ping', exact: true })
}

function timer(page: Page) {
  return demo(page).getByTestId('round-trip-timer')
}

function packet(page: Page) {
  return demo(page).getByTestId('ping-pong-packet')
}

async function elapsed(page: Page) {
  return Number.parseFloat((await timer(page).textContent()) ?? '')
}

async function openDemo(page: Page) {
  await page.goto(`${chapterPath}/8`)
  await expect(demo(page)).toBeVisible()
  await expect(demo(page).getByTestId('bucky-phone')).toBeVisible()
  await expect(demo(page).getByTestId('program-laptop')).toBeVisible()
}

async function expectFresh(page: Page) {
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/8$`))
  await expect(timer(page)).toHaveAttribute('data-state', 'idle')
  await expect(timer(page)).toHaveText('0.00s')
  await expect(sendButton(page)).toBeEnabled()
  await expect(packet(page)).toHaveCount(0)
  await expect(demo(page).getByTestId('program-ping-received')).toHaveCount(0)
  await expect(demo(page).getByTestId('program-pong-sent')).toHaveCount(0)
  await expect(demo(page).getByTestId('phone-pong-received')).toHaveCount(0)
}

async function expectProgramReplied(page: Page) {
  await expect(demo(page).getByTestId('program-ping-received')).toContainText(
    'Ping',
  )
  await expect(demo(page).getByTestId('program-ping-received')).toBeVisible()
  await expect(demo(page).getByTestId('program-pong-sent')).toContainText(
    'Pong',
  )
  await expect(demo(page).getByTestId('program-pong-sent')).toBeVisible()
}

async function expectComplete(page: Page) {
  // Four natural 1400 ms legs take longer than Playwright's default assertion timeout.
  await expect(timer(page)).toHaveAttribute('data-state', 'stopped', {
    timeout: 8000,
  })
  await expectProgramReplied(page)
  await expect(demo(page).getByTestId('phone-pong-received')).toContainText(
    'Pong',
  )
  await expect(demo(page).getByTestId('phone-pong-received')).toBeVisible()
  await expect(packet(page)).toHaveCount(0)
  await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
}

async function expectHeldResult(page: Page) {
  const result = await timer(page).textContent()
  await sendButton(page).click({ force: true })
  await sendButton(page).press('Enter')
  await sendButton(page).press('Space')
  await page.waitForTimeout(300)
  await expectComplete(page)
  await expect(timer(page)).toHaveText(result ?? '')
  await expect(demo(page).getByTestId('phone-pong-received')).toHaveCount(1)
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`Ping waits for Send and the program returns Pong through Core before the timer stops (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    await expectFresh(page)
    await page.waitForTimeout(2000)
    await expectFresh(page)
    await sendButton(page).click()
    if (reducedMotion === 'no-preference') {
      for (const leg of legs) {
        await expect(packet(page)).toHaveAttribute('data-leg', leg)
        await expect(packet(page)).toContainText(
          leg.startsWith('ping') ? 'Ping' : 'Pong',
        )
        await expect(timer(page)).toHaveAttribute('data-state', 'running')
        await expect(demo(page).getByTestId('phone-pong-received')).toHaveCount(
          0,
        )
        if (leg.startsWith('ping')) {
          await expect(
            demo(page).getByTestId('program-ping-received'),
          ).toHaveCount(0)
          await expect(demo(page).getByTestId('program-pong-sent')).toHaveCount(
            0,
          )
        } else {
          await expectProgramReplied(page)
          expect(await elapsed(page)).toBeGreaterThanOrEqual(2.6)
        }
      }
    }
    await expectComplete(page)
    if (reducedMotion === 'reduce') {
      await expect(timer(page)).toHaveText('0.00s')
    } else {
      expect(await elapsed(page)).toBeGreaterThanOrEqual(5.4)
      expect(await elapsed(page)).toBeLessThan(6.5)
    }
    await expectHeldResult(page)
  })

  test(`Enter and Space start one round trip despite repeated activation (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const key of ['Enter', 'Space']) {
      await expectFresh(page)
      await sendButton(page).focus()
      await page.keyboard.press(key)
      await expect(sendButton(page)).toBeFocused()
      await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
      await page.keyboard.down(key)
      await page.keyboard.down(key)
      await page.keyboard.up(key)
      await sendButton(page).click({ force: true })
      if (reducedMotion === 'no-preference') {
        await expect(packet(page)).toHaveCount(1)
        await expect(packet(page)).toHaveAttribute('data-leg', 'ping-to-core')
      }
      await expectComplete(page)
      await expectHeldResult(page)
      await page
        .getByRole('button', { name: 'Replay animation', exact: true })
        .click()
    }
    await expectFresh(page)
  })

  test(`Replay, slide re-entry, and reload cancel the round trip and reset the clock (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const reset of ['replay', 're-entry', 'reload']) {
      await sendButton(page).click()
      if (reducedMotion === 'no-preference') {
        await expect(packet(page)).toHaveAttribute('data-leg', 'pong-to-core')
        await expectProgramReplied(page)
      } else {
        await expectComplete(page)
      }
      if (reset === 'replay') {
        await page
          .getByRole('button', { name: 'Replay animation', exact: true })
          .click()
      } else if (reset === 're-entry') {
        await page
          .getByRole('button', { name: 'Previous slide', exact: true })
          .click()
        await expect(page.getByTestId('coins-data-demo')).toBeVisible()
        await page
          .getByRole('button', { name: 'Next slide', exact: true })
          .click()
      } else {
        await page.reload()
      }
      await expectFresh(page)
      // The discarded Pong must never arrive in the newly mounted scene.
      await page.waitForTimeout(reducedMotion === 'no-preference' ? 3100 : 200)
      await expectFresh(page)
    }
  })
}

test('Pause freezes the displayed time and packet on each of the four legs', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  await sendButton(page).click()
  for (const leg of legs) {
    await expect(packet(page)).toHaveAttribute('data-leg', leg)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    // Pause renders the final active interval on the next frame before holding.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        }),
    )
    const pausedTime = await timer(page).textContent()
    await page.waitForTimeout(1700)
    await expect(packet(page)).toHaveAttribute('data-leg', leg)
    await expect(timer(page)).toHaveText(pausedTime ?? '')
    await expect(timer(page)).toHaveAttribute('data-state', 'running')
    await expect(demo(page).getByTestId('phone-pong-received')).toHaveCount(0)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
  }
  await expectComplete(page)
  // Paused wall time must be excluded from the demonstration's result.
  expect(await elapsed(page)).toBeGreaterThanOrEqual(5.4)
  expect(await elapsed(page)).toBeLessThan(6.5)
})

test('sending while paused holds the timer at zero until Resume', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await sendButton(page).click()
  await expect(packet(page)).toHaveAttribute('data-leg', 'ping-to-core')
  await expect(timer(page)).toHaveAttribute('data-state', 'running')
  await page.waitForTimeout(1700)
  await expect(timer(page)).toHaveText('0.00s')
  await expect(packet(page)).toHaveAttribute('data-leg', 'ping-to-core')
  await page
    .getByRole('button', { name: 'Resume animation', exact: true })
    .click()
  await expectComplete(page)
  expect(await elapsed(page)).toBeGreaterThanOrEqual(5.4)
  expect(await elapsed(page)).toBeLessThan(6.5)
})

test('switching to reduced motion during any leg completes once and freezes elapsed time', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  for (const leg of legs) {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await sendButton(page).click()
    await expect(packet(page)).toHaveAttribute('data-leg', leg)
    const before = await elapsed(page)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expectComplete(page)
    const after = await elapsed(page)
    expect(after).toBeGreaterThanOrEqual(before)
    expect(after - before).toBeLessThan(0.5)
    await expectHeldResult(page)
    await page
      .getByRole('button', { name: 'Replay animation', exact: true })
      .click()
    await expectFresh(page)
  }
})
