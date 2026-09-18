import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const chapterPath = '/#/chapters/core-architecture'
const legs = [
  'guess-to-core',
  'guess-to-program',
  'result-to-core',
  'result-to-phone',
] as const

function demo(page: Page) {
  return page.getByTestId('guessing-game-demo')
}

function sendButton(page: Page) {
  return demo(page).getByRole('button', { name: 'Send', exact: true })
}

function guessInput(page: Page) {
  return demo(page).getByLabel('Your guess', { exact: true })
}

function packet(page: Page) {
  return demo(page).getByTestId('guessing-game-packet')
}

function result(guess: number) {
  return guess === 5 ? 'You win' : 'You lose'
}

async function expectBalances(page: Page, bucky: number, app: number) {
  await expect(demo(page).getByTestId('bucky-balance')).toHaveText(
    String(bucky),
  )
  await expect(demo(page).getByTestId('app-balance')).toHaveText(String(app))
}

async function openDemo(page: Page) {
  await page.goto(`${chapterPath}/10`)
  await expect(demo(page)).toBeVisible()
  await expect(demo(page).getByTestId('bucky-phone')).toBeVisible()
  await expect(demo(page).getByTestId('program-laptop')).toBeVisible()
}

async function expectFresh(page: Page) {
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/10$`))
  await expectBalances(page, 100, 100)
  await expect(guessInput(page)).toHaveValue('1')
  await expect(guessInput(page)).toBeEditable()
  await expect(sendButton(page)).toBeEnabled()
  await expect(packet(page)).toHaveCount(0)
  await expect(demo(page).getByTestId('game-program-result')).toHaveCount(0)
  await expect(demo(page).getByTestId('game-phone-result')).toHaveCount(0)
  await expect(demo(page).getByTestId('game-coin-received')).toHaveCount(0)
}

async function expectComplete(page: Page, guess: number) {
  await expect(demo(page).getByTestId('game-phone-result')).toHaveText(
    result(guess),
    { timeout: 8000 },
  )
  await expect(demo(page).getByTestId('game-phone-result')).toBeVisible()
  await expect(demo(page).getByTestId('game-program-result')).toHaveText(
    result(guess),
  )
  await expectBalances(page, guess === 5 ? 109 : 99, guess === 5 ? 91 : 101)
  if (guess === 5) {
    await expect(demo(page).getByTestId('game-coin-received')).toBeVisible()
    await expect(demo(page).getByTestId('game-coin-received')).toContainText(
      '+10',
    )
    await expect(demo(page).getByTestId('game-coin-received')).toContainText(
      'Bacoin',
    )
  } else {
    await expect(demo(page).getByTestId('game-coin-received')).toHaveCount(0)
  }
  await expect(packet(page)).toHaveCount(0)
  await expect(guessInput(page)).toHaveJSProperty('readOnly', true)
  await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
}

async function replay(page: Page) {
  await page
    .getByRole('button', { name: 'Replay animation', exact: true })
    .click()
  await expectFresh(page)
}

test('slide 9 introduces standalone Bacoin Core without a form or account table', async ({
  page,
}) => {
  await page.goto(`${chapterPath}/9`)
  const scene = page.locator('.architecture-scene')
  await expect(scene.getByText('Bacoin Core', { exact: true })).toBeVisible()
  await expect(scene).not.toContainText('Bonsai Core')
  await expect(scene.getByRole('table')).toHaveCount(0)
  await expect(scene.locator('input, textarea, button')).toHaveCount(0)
  await expect(scene.getByTestId('bucky-phone')).toHaveCount(0)
  await expect(scene.getByTestId('program-laptop')).toHaveCount(0)
})

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  for (const guess of [1, 5]) {
    test(`guess ${guess} records the entry transfer and ${guess === 5 ? 'prize before phone receipt' : 'payload-only loss'} (${reducedMotion})`, async ({
      page,
    }) => {
      await page.emulateMedia({ reducedMotion })
      await openDemo(page)
      await expectFresh(page)
      await expect(
        demo(page).getByRole('table', {
          name: 'Bacoin Core account balances',
          exact: true,
        }),
      ).toBeVisible()
      await expect(
        demo(page).getByText('Bacoin Core', { exact: true }),
      ).toBeVisible()
      await expect(
        demo(page).getByLabel('Recipient on Bucky’s phone', { exact: true }),
      ).toHaveValue('Guessing game')
      await expect(
        demo(page).getByLabel('Recipient on Bucky’s phone', { exact: true }),
      ).toHaveJSProperty('readOnly', true)
      await expect(
        demo(page).getByLabel('Amount to Guessing game', { exact: true }),
      ).toHaveValue('1')
      await expect(
        demo(page).getByLabel('Amount to Guessing game', { exact: true }),
      ).toHaveJSProperty('readOnly', true)
      await page.waitForTimeout(1700)
      await expectFresh(page)
      await guessInput(page).fill(String(guess))
      await sendButton(page).click()
      await expect(guessInput(page)).toHaveJSProperty('readOnly', true)
      if (reducedMotion === 'no-preference') {
        for (const leg of legs) {
          await expect(packet(page)).toHaveAttribute('data-leg', leg)
          await expect(demo(page).getByTestId('game-phone-result')).toHaveCount(
            0,
          )
          await expect(
            demo(page).getByTestId('game-coin-received'),
          ).toHaveCount(0)
          if (leg === 'guess-to-core') {
            await expectBalances(page, 100, 100)
          } else if (leg === 'result-to-phone' && guess === 5) {
            await expectBalances(page, 109, 91)
          } else {
            await expectBalances(page, 99, 101)
          }
          if (leg.startsWith('guess')) {
            await expect(
              packet(page).getByTestId('game-packet-amount'),
            ).toContainText('1')
            await expect(
              demo(page).getByTestId('game-program-result'),
            ).toHaveCount(0)
          } else {
            await expect(
              demo(page).getByTestId('game-program-result'),
            ).toHaveText(result(guess))
            await expect(packet(page)).toContainText(result(guess))
            if (guess === 5) {
              await expect(
                packet(page).getByTestId('game-packet-amount'),
              ).toContainText('10')
            } else {
              await expect(
                packet(page).getByTestId('game-packet-amount'),
              ).toHaveCount(0)
            }
          }
        }
      }
      await expectComplete(page, guess)
    })
  }

  test(`keyboard Send and repeated activations cannot charge or pay twice (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const [guess, key] of [
      [5, 'Enter'],
      [1, 'Space'],
    ] as const) {
      await guessInput(page).fill(String(guess))
      await guessInput(page).press('Home')
      await guessInput(page).press('End')
      await guessInput(page).press('ArrowRight')
      await expect(page).toHaveURL(new RegExp(`${chapterPath}/10$`))
      await sendButton(page).focus()
      await page.keyboard.press(key)
      await expect(sendButton(page)).toBeFocused()
      await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
      await page.keyboard.down(key)
      await page.keyboard.down(key)
      await page.keyboard.up(key)
      await sendButton(page).click({ force: true })
      await expectComplete(page, guess)
      await sendButton(page).click({ force: true })
      await sendButton(page).press(key)
      await expectComplete(page, guess)
      await expect(demo(page).getByTestId('game-phone-result')).toHaveCount(1)
      await replay(page)
    }
  })

  test(`Replay, re-entry, and reload cancel the round and restore both balances (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const [reset, guess] of [
      ['replay', 5],
      ['re-entry', 1],
      ['reload', 5],
    ] as const) {
      await guessInput(page).fill(String(guess))
      await sendButton(page).click()
      if (reducedMotion === 'no-preference') {
        await expect(packet(page)).toHaveAttribute('data-leg', 'result-to-core')
      } else {
        await expectComplete(page, guess)
      }
      if (reset === 'replay') {
        await replay(page)
      } else if (reset === 're-entry') {
        await page
          .getByRole('button', { name: 'Previous slide', exact: true })
          .click()
        await expect(page.locator('.architecture-scene')).toContainText(
          'Bacoin Core',
        )
        await expect(page.getByTestId('guessing-game-demo')).toHaveCount(0)
        await page
          .getByRole('button', { name: 'Next slide', exact: true })
          .click()
      } else {
        await page.reload()
      }
      await expectFresh(page)
      await page.waitForTimeout(reducedMotion === 'no-preference' ? 3100 : 200)
      await expectFresh(page)
    }
  })
}

test('only whole guesses 1 through 10 can send, and only 5 wins', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDemo(page)
  for (const invalid of ['', '0', '11', '1.5']) {
    await guessInput(page).fill(invalid)
    await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
    await sendButton(page).click({ force: true })
    await sendButton(page).press('Enter')
    await expectBalances(page, 100, 100)
    await expect(packet(page)).toHaveCount(0)
    await expect(demo(page).getByTestId('game-phone-result')).toHaveCount(0)
    await expect(guessInput(page)).toBeEditable()
  }
  for (let guess = 1; guess <= 10; guess += 1) {
    await guessInput(page).fill(String(guess))
    await expect(sendButton(page)).toBeEnabled()
    await sendButton(page).click()
    await expectComplete(page, guess)
    await replay(page)
  }
})

test('Pause holds every request leg and both stages of account changes', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  await guessInput(page).fill('5')
  await sendButton(page).click()
  for (const leg of legs) {
    await expect(packet(page)).toHaveAttribute('data-leg', leg)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    await page.waitForTimeout(1700)
    await expect(packet(page)).toHaveAttribute('data-leg', leg)
    const bucky =
      leg === 'guess-to-core' ? 100 : leg === 'result-to-phone' ? 109 : 99
    await expectBalances(page, bucky, 200 - bucky)
    await expect(demo(page).getByTestId('game-phone-result')).toHaveCount(0)
    await expect(demo(page).getByTestId('game-coin-received')).toHaveCount(0)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
  }
  await expectComplete(page, 5)
})

test('switching to reduced motion completes a winning or losing round only once', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  for (const guess of [1, 5]) {
    for (const leg of ['guess-to-core', 'result-to-core']) {
      await page.emulateMedia({ reducedMotion: 'no-preference' })
      await guessInput(page).fill(String(guess))
      await sendButton(page).click()
      await expect(packet(page)).toHaveAttribute('data-leg', leg)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      await expectComplete(page, guess)
      await sendButton(page).click({ force: true })
      await expectComplete(page, guess)
      await replay(page)
    }
  }
})
