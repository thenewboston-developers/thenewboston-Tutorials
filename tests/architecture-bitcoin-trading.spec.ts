import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

type Mode = 'buy' | 'sell'
const chapterPath = '/#/chapters/core-architecture'
const slideNumber = { buy: 11, sell: 12 }

function demo(page: Page) {
  return page.getByTestId('bitcoin-trade-demo')
}
function action(page: Page, name: string) {
  return demo(page).getByRole('button', { name, exact: true })
}
function receipt(page: Page) {
  return demo(page).getByTestId('trade-phone-receipt')
}
function packet(page: Page) {
  return demo(page).getByTestId('bitcoin-trade-packet')
}
function depositAddress(page: Page) {
  return demo(page).getByLabel('Bitcoin deposit address', { exact: true })
}

async function phase(page: Page, value: string) {
  await expect(demo(page)).toHaveAttribute('data-phase', value, {
    timeout: 9000,
  })
}

async function balances(
  page: Page,
  bucky: number,
  app: number,
  buckyBtc: number,
  appBtc: number,
) {
  await expect(demo(page).getByTestId('bucky-balance')).toHaveText(
    String(bucky),
  )
  await expect(demo(page).getByTestId('app-balance')).toHaveText(String(app))
  await expect(demo(page).getByTestId('bucky-bitcoin-balance')).toHaveText(
    new RegExp(`^${buckyBtc}\\s*BTC$`),
  )
  await expect(demo(page).getByTestId('app-bitcoin-balance')).toHaveText(
    new RegExp(`^${appBtc}\\s*BTC$`),
  )
}

async function openTrade(page: Page, mode: Mode) {
  await page.goto(`${chapterPath}/${slideNumber[mode]}`)
  await expect(demo(page)).toBeVisible()
  await expect(demo(page)).toHaveAttribute('data-mode', mode)
  await expect(demo(page).getByTestId('bitcoin-node')).toBeVisible()
}

async function fresh(page: Page, mode: Mode) {
  await phase(page, 'ready')
  await balances(
    page,
    mode === 'buy' ? 100 : 0,
    mode === 'buy' ? 100 : 200,
    mode === 'buy' ? 0 : 1,
    mode === 'buy' ? 1 : 0,
  )
  await expect(
    action(page, mode === 'buy' ? 'Buy 1 BTC' : 'Request address'),
  ).toBeEnabled()
  await expect(packet(page)).toHaveCount(0)
  await expect(receipt(page)).toHaveCount(0)
  await expect(demo(page).getByTestId('bitcoin-confirmation')).toHaveCount(0)
  if (mode === 'sell') {
    await expect(depositAddress(page)).toHaveValue('')
    await expect(action(page, 'Send 1 BTC')).toHaveCount(0)
    await expect(demo(page).getByTestId('deposit-monitor')).toHaveCount(0)
  }
}

async function awaitingBitcoin(page: Page) {
  await phase(page, 'awaiting-bitcoin')
  await balances(page, 0, 200, 1, 0)
  await expect(depositAddress(page)).toHaveValue('bc1q…trade')
  await expect(depositAddress(page)).toHaveJSProperty('readOnly', true)
  await expect(action(page, 'Send 1 BTC')).toBeEnabled()
  await expect(demo(page).getByTestId('deposit-monitor')).toContainText(
    'Monitoring deposit',
  )
  await expect(packet(page)).toHaveCount(0)
  await expect(receipt(page)).toHaveCount(0)
}

async function complete(page: Page, mode: Mode) {
  await phase(page, 'complete')
  await balances(
    page,
    mode === 'buy' ? 0 : 100,
    mode === 'buy' ? 200 : 100,
    mode === 'buy' ? 1 : 0,
    mode === 'buy' ? 0 : 1,
  )
  await expect(receipt(page)).toBeVisible()
  await expect(receipt(page)).toContainText(
    mode === 'buy' ? /\+1\s*BTC/ : /\+100\s*Tuna/,
  )
  await expect(
    action(page, mode === 'buy' ? 'Buy 1 BTC' : 'Send 1 BTC'),
  ).toHaveAttribute('aria-disabled', 'true')
  await expect(packet(page)).toHaveCount(0)
  await expect(demo(page).getByTestId('bitcoin-confirmation')).toHaveCount(0)
}

async function guardRepeated(page: Page, name: string) {
  const button = action(page, name)
  await button.click({ force: true })
  await button.press('Enter')
  await button.press('Space')
}

async function fastAddress(page: Page) {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await action(page, 'Request address').click()
  await awaitingBitcoin(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`buy pays Tuna before Bitcoin confirmation and reveals the receipt only at the phone (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openTrade(page, 'buy')
    await fresh(page, 'buy')
    for (const [label, value] of [
      ['Recipient on Bucky’s phone', 'Trading app'],
      ['Amount to Trading app', '100'],
      ['Bitcoin receiving address', 'bc1q…bucky'],
    ]) {
      await expect(demo(page).getByLabel(label, { exact: true })).toHaveValue(
        value,
      )
      await expect(
        demo(page).getByLabel(label, { exact: true }),
      ).toHaveJSProperty('readOnly', true)
    }
    await page.waitForTimeout(1500)
    await fresh(page, 'buy')
    await action(page, 'Buy 1 BTC').click()
    await expect(action(page, 'Buy 1 BTC')).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    if (reducedMotion === 'no-preference') {
      await guardRepeated(page, 'Buy 1 BTC')
      for (const leg of [
        'payment-to-core',
        'payment-to-app',
        'bitcoin-to-node',
        'confirming',
        'bitcoin-to-phone',
      ]) {
        await phase(page, leg)
        await expect(receipt(page)).toHaveCount(0)
        await balances(
          page,
          leg === 'payment-to-core' ? 100 : 0,
          leg === 'payment-to-core' ? 100 : 200,
          0,
          leg === 'bitcoin-to-phone' ? 0 : 1,
        )
        if (leg === 'confirming') {
          await expect(
            demo(page).getByTestId('bitcoin-confirmation'),
          ).toHaveCount(1)
          await expect(demo(page).getByRole('status')).toHaveText('Confirming…')
        } else {
          await expect(packet(page)).toHaveAttribute('data-leg', leg)
        }
      }
    }
    await complete(page, 'buy')
    await guardRepeated(page, 'Buy 1 BTC')
    await complete(page, 'buy')
  })

  test(`sell requests an address, waits for manual Bitcoin send, and pays only after confirmed app receipt (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openTrade(page, 'sell')
    await fresh(page, 'sell')
    await action(page, 'Request address').click()
    if (reducedMotion === 'no-preference') {
      await expect(action(page, 'Request address')).toHaveAttribute(
        'aria-disabled',
        'true',
      )
      await guardRepeated(page, 'Request address')
      for (const leg of [
        'address-request-to-core',
        'address-request-to-app',
        'address-to-core',
        'address-to-phone',
      ]) {
        await phase(page, leg)
        await expect(packet(page)).toHaveAttribute('data-leg', leg)
        await expect(
          packet(page).getByTestId('trade-packet-amount'),
        ).toHaveCount(0)
        await balances(page, 0, 200, 1, 0)
        await expect(depositAddress(page)).toHaveValue('')
        await expect(action(page, 'Send 1 BTC')).toHaveCount(0)
        if (leg === 'address-to-core' || leg === 'address-to-phone') {
          await expect(demo(page).getByTestId('deposit-monitor')).toContainText(
            'Monitoring deposit',
          )
        }
      }
    }
    await awaitingBitcoin(page)
    await page.waitForTimeout(1700)
    await awaitingBitcoin(page)
    await action(page, 'Send 1 BTC').click()
    await expect(action(page, 'Send 1 BTC')).toHaveAttribute(
      'aria-disabled',
      'true',
    )
    if (reducedMotion === 'no-preference') {
      await guardRepeated(page, 'Send 1 BTC')
      for (const leg of [
        'deposit-to-node',
        'confirming',
        'deposit-to-app',
        'payout-to-core',
        'payout-to-phone',
      ]) {
        await phase(page, leg)
        await expect(receipt(page)).toHaveCount(0)
        const confirmed = !['deposit-to-node', 'confirming'].includes(leg)
        await balances(
          page,
          leg === 'payout-to-phone' ? 100 : 0,
          leg === 'payout-to-phone' ? 100 : 200,
          confirmed ? 0 : 1,
          leg === 'payout-to-core' || leg === 'payout-to-phone' ? 1 : 0,
        )
        if (leg === 'confirming') {
          await expect(
            demo(page).getByTestId('bitcoin-confirmation'),
          ).toHaveCount(1)
          await expect(demo(page).getByRole('status')).toHaveText('Confirming…')
          await expect(demo(page).getByTestId('deposit-monitor')).toContainText(
            'Monitoring deposit',
          )
        } else {
          await expect(packet(page)).toHaveAttribute('data-leg', leg)
        }
      }
    }
    await complete(page, 'sell')
    await guardRepeated(page, 'Send 1 BTC')
    await complete(page, 'sell')
  })
}

test('keyboard activation buys once and cannot skip the sell address step', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openTrade(page, 'buy')
  await action(page, 'Buy 1 BTC').focus()
  await page.keyboard.press('Enter')
  await complete(page, 'buy')
  await guardRepeated(page, 'Buy 1 BTC')
  await complete(page, 'buy')
  await openTrade(page, 'sell')
  await action(page, 'Request address').focus()
  await page.keyboard.press('Space')
  await awaitingBitcoin(page)
  // The first keyboard activation requests an address; it never deposits BTC.
  await page.waitForTimeout(1300)
  await awaitingBitcoin(page)
  await action(page, 'Send 1 BTC').focus()
  await page.keyboard.press('Enter')
  await complete(page, 'sell')
  await guardRepeated(page, 'Send 1 BTC')
  await complete(page, 'sell')
})

test('a reduced-motion double click or held key cannot consume the newly revealed deposit action', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  for (const activation of ['double-click', 'Enter', 'Space']) {
    await openTrade(page, 'sell')
    await fresh(page, 'sell')
    if (activation === 'double-click') {
      await action(page, 'Request address').dblclick()
    } else {
      await action(page, 'Request address').focus()
      await page.keyboard.down(activation)
      await page.keyboard.down(activation)
      await page.keyboard.down(activation)
      await page.keyboard.up(activation)
    }
    await awaitingBitcoin(page)
    // Releasing the original gesture leaves a separate, deliberate send step.
    await page.waitForTimeout(300)
    await awaitingBitcoin(page)
    await action(page, 'Send 1 BTC').click()
    await complete(page, 'sell')
    await page
      .getByRole('button', { name: 'Replay animation', exact: true })
      .click()
    await fresh(page, 'sell')
  }
})

for (const mode of ['buy', 'sell'] as const) {
  test(`Pause holds ${mode} confirmation and prevents premature settlement`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await openTrade(page, mode)
    if (mode === 'sell') await fastAddress(page)
    await action(page, mode === 'buy' ? 'Buy 1 BTC' : 'Send 1 BTC').click()
    await phase(page, 'confirming')
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    await page.waitForTimeout(1500)
    await phase(page, 'confirming')
    await expect(demo(page).getByTestId('bitcoin-confirmation')).toHaveCount(1)
    await expect(demo(page).getByRole('status')).toHaveText('Confirming…')
    await balances(page, 0, 200, mode === 'buy' ? 0 : 1, mode === 'buy' ? 1 : 0)
    await expect(receipt(page)).toHaveCount(0)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
    const leg = mode === 'buy' ? 'bitcoin-to-phone' : 'payout-to-core'
    await phase(page, leg)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    await page.waitForTimeout(1500)
    await phase(page, leg)
    await expect(receipt(page)).toHaveCount(0)
    await balances(page, 0, 200, 0, mode === 'buy' ? 0 : 1)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
    await complete(page, mode)
  })

  test(`Replay, re-entry and reload cancel ${mode} confirmation and restore its starting state`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await openTrade(page, mode)
    for (const reset of ['replay', 're-entry', 'reload']) {
      if (mode === 'sell') await fastAddress(page)
      await action(page, mode === 'buy' ? 'Buy 1 BTC' : 'Send 1 BTC').click()
      await phase(page, 'confirming')
      if (reset === 'replay') {
        await page
          .getByRole('button', { name: 'Replay animation', exact: true })
          .click()
      } else if (reset === 're-entry') {
        await page
          .getByRole('button', { name: 'Previous slide', exact: true })
          .click()
        if (mode === 'buy') {
          await expect(page.getByTestId('guessing-game-demo')).toBeVisible()
        } else {
          await expect(demo(page)).toHaveAttribute('data-mode', 'buy')
        }
        await page
          .getByRole('button', { name: 'Next slide', exact: true })
          .click()
      } else {
        await page.reload()
      }
      await expect(demo(page)).toHaveAttribute('data-mode', mode)
      await fresh(page, mode)
      // Longer than the discarded confirmation and remaining delivery legs.
      await page.waitForTimeout(reset === 'replay' ? 5700 : 200)
      await fresh(page, mode)
    }
  })
}

test('changing to reduced motion finishes only the active buy or sell segment', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openTrade(page, 'buy')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await fresh(page, 'buy')
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await action(page, 'Buy 1 BTC').click()
  await phase(page, 'confirming')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await complete(page, 'buy')
  await guardRepeated(page, 'Buy 1 BTC')
  await complete(page, 'buy')

  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openTrade(page, 'sell')
  await action(page, 'Request address').click()
  await phase(page, 'address-to-core')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await awaitingBitcoin(page)
  await page.waitForTimeout(1500)
  await awaitingBitcoin(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await awaitingBitcoin(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await action(page, 'Send 1 BTC').click()
  await phase(page, 'confirming')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await complete(page, 'sell')
  await guardRepeated(page, 'Send 1 BTC')
  await complete(page, 'sell')
})
