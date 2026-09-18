import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const chapterPath = '/#/chapters/core-architecture'
const defaultMessage = 'Here you go'

function demo(page: Page) {
  return page.getByTestId('coins-data-demo')
}

function sendButton(page: Page) {
  return demo(page)
    .getByTestId('bucky-phone')
    .getByRole('button', { name: 'Send', exact: true })
}

function amountInput(page: Page) {
  return demo(page).getByLabel('Amount to Ty', { exact: true })
}

function messageInput(page: Page) {
  return demo(page).getByLabel('Message to Ty', { exact: true })
}

async function openDemo(page: Page) {
  await page.goto(`${chapterPath}/7`)
  await expect(demo(page)).toBeVisible()
}

async function expectBalances(page: Page, bucky: number, ty: number) {
  await expect(demo(page).getByTestId('bucky-balance')).toHaveText(
    String(bucky),
  )
  await expect(demo(page).getByTestId('ty-balance')).toHaveText(String(ty))
}

async function expectNoReceipt(page: Page) {
  await expect(demo(page).getByTestId('chat-ty-received')).toHaveCount(0)
  await expect(demo(page).getByTestId('ty-coin-received')).toHaveCount(0)
}

async function expectFreshDemo(page: Page) {
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/7$`))
  await expectBalances(page, 99, 1)
  await expect(amountInput(page)).toHaveValue('1')
  await expect(messageInput(page)).toHaveValue(defaultMessage)
  await expect(amountInput(page)).toBeEditable()
  await expect(messageInput(page)).toBeEditable()
  await expect(sendButton(page)).toBeEnabled()
  await expect(demo(page).getByTestId('bucky-change')).toBeHidden()
  await expect(demo(page).getByTestId('ty-change')).toBeHidden()
  await expect(demo(page).getByTestId('coin-message-packet')).toHaveCount(0)
  await expectNoReceipt(page)
}

async function expectDelivered(
  page: Page,
  amount = 1,
  message = defaultMessage,
) {
  await expectBalances(page, 99 - amount, 1 + amount)
  await expect(demo(page).getByTestId('bucky-change')).toHaveText(`−${amount}`)
  await expect(demo(page).getByTestId('ty-change')).toHaveText(`+${amount}`)
  await expect(demo(page).getByTestId('chat-ty-received')).toHaveText(message)
  await expect(demo(page).getByTestId('chat-ty-received')).toBeVisible()
  await expect(demo(page).getByTestId('ty-coin-received')).toContainText(
    new RegExp(`\\b${amount}\\b`),
  )
  await expect(demo(page).getByTestId('ty-coin-received')).toBeVisible()
  await expect(demo(page).getByTestId('coin-message-packet')).toHaveCount(0)
  await expect(messageInput(page)).toHaveValue('')
  await expect(amountInput(page)).toHaveJSProperty('readOnly', true)
  await expect(messageInput(page)).toHaveJSProperty('readOnly', true)
  await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`coins and data wait for Send, settle at Core, and reach Ty together (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    await expectFreshDemo(page)
    await expect(
      demo(page).getByLabel('Recipient on Bucky’s phone', { exact: true }),
    ).toHaveValue('Ty')
    await expect(
      demo(page).getByLabel('Recipient on Bucky’s phone', { exact: true }),
    ).toHaveJSProperty('readOnly', true)
    await page.waitForTimeout(3000)
    await expectFreshDemo(page)

    await sendButton(page).click()
    await expect(messageInput(page)).toHaveValue('')
    await expect(amountInput(page)).toHaveJSProperty('readOnly', true)
    await expect(messageInput(page)).toHaveJSProperty('readOnly', true)
    if (reducedMotion === 'no-preference') {
      const packet = demo(page).getByTestId('coin-message-packet')
      await expect(packet).toHaveAttribute('data-leg', 'to-core')
      await expect(packet).toContainText(defaultMessage)
      await expectBalances(page, 99, 1)
      await expectNoReceipt(page)
      await expect(packet).toHaveAttribute('data-leg', 'to-phone')
      await expectBalances(page, 98, 2)
      await expect(demo(page).getByTestId('bucky-change')).toHaveText('−1')
      await expect(demo(page).getByTestId('ty-change')).toHaveText('+1')
      await expectNoReceipt(page)
    }
    await expectDelivered(page)
    // No automatic reply or second transfer follows the completed delivery.
    await page.waitForTimeout(3200)
    await expectDelivered(page)
    await expect(demo(page).getByTestId('chat-bucky-received')).toHaveCount(0)
    await expect(demo(page).getByTestId('chat-ty-received')).toHaveCount(1)
    await expect(demo(page).getByTestId('ty-coin-received')).toHaveCount(1)
    await expect(
      demo(page).getByLabel('Message to Bucky', { exact: true }),
    ).toHaveValue('')
    await expect(
      demo(page)
        .getByTestId('ty-phone')
        .getByRole('button', { name: 'Send', exact: true }),
    ).toHaveAttribute('aria-disabled', 'true')
  })

  test(`edited amount and message are captured, and keyboard input does not navigate away (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    await amountInput(page).fill('25')
    await amountInput(page).press('Home')
    await amountInput(page).press('End')
    await amountInput(page).press('ArrowLeft')
    await amountInput(page).press('ArrowRight')
    await messageInput(page).fill('For the bonsai tree.')
    await messageInput(page).press('Home')
    await messageInput(page).press('End')
    await messageInput(page).press('ArrowLeft')
    await messageInput(page).press('ArrowRight')
    await expect(page).toHaveURL(new RegExp(`${chapterPath}/7$`))
    await sendButton(page).click()
    await expect(messageInput(page)).toHaveValue('')
    if (reducedMotion === 'no-preference') {
      await expect(demo(page).getByTestId('coin-message-packet')).toContainText(
        'For the bonsai tree.',
      )
    }
    await expectDelivered(page, 25, 'For the bonsai tree.')
  })

  test(`Enter and Space submit once despite repeated activation (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const key of ['Enter', 'Space']) {
      await expectFreshDemo(page)
      await sendButton(page).focus()
      await page.keyboard.press(key)
      await expect(sendButton(page)).toBeFocused()
      await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
      await page.keyboard.down(key)
      await page.keyboard.down(key)
      await page.keyboard.up(key)
      await sendButton(page).click({ force: true })
      await expectDelivered(page)
      await sendButton(page).click({ force: true })
      await sendButton(page).press(key)
      await expectDelivered(page)
      await expect(demo(page).getByTestId('chat-ty-received')).toHaveCount(1)
      await page
        .getByRole('button', { name: 'Replay animation', exact: true })
        .click()
    }
    await expectFreshDemo(page)
  })

  test(`Replay, slide re-entry, and reload restore a fresh transfer (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const reset of ['replay', 're-entry', 'reload']) {
      await amountInput(page).fill('25')
      await messageInput(page).fill('A fresh start.')
      await sendButton(page).click()
      if (reducedMotion === 'no-preference') {
        await expect(
          demo(page).getByTestId('coin-message-packet'),
        ).toHaveAttribute('data-leg', 'to-phone')
      } else {
        await expectDelivered(page, 25, 'A fresh start.')
      }
      if (reset === 'replay') {
        await page
          .getByRole('button', { name: 'Replay animation', exact: true })
          .click()
      } else if (reset === 're-entry') {
        await page
          .getByRole('button', { name: 'Previous slide', exact: true })
          .click()
        await expect(page.getByTestId('messaging-demo')).toBeVisible()
        await page
          .getByRole('button', { name: 'Next slide', exact: true })
          .click()
      } else {
        await page.reload()
      }
      await expectFreshDemo(page)
      // A discarded delivery must not arrive in the remounted demonstration.
      await page.waitForTimeout(1700)
      await expectFreshDemo(page)
    }
  })
}

test('invalid amounts and empty messages cannot send; the full balance is a valid whole amount', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDemo(page)
  for (const value of ['', '0', '-1', '100', '1.5']) {
    await amountInput(page).fill(value)
    await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
    await sendButton(page).click({ force: true })
    await sendButton(page).press('Enter')
    await expectBalances(page, 99, 1)
    await expectNoReceipt(page)
    await expect(demo(page).getByTestId('coin-message-packet')).toHaveCount(0)
    await expect(messageInput(page)).toHaveValue(defaultMessage)
  }
  await amountInput(page).fill('99')
  for (const value of ['', '   ']) {
    await messageInput(page).fill(value)
    await expect(sendButton(page)).toHaveAttribute('aria-disabled', 'true')
    await sendButton(page).click({ force: true })
    await expectBalances(page, 99, 1)
    await expectNoReceipt(page)
  }
  await messageInput(page).fill('All ninety-nine.')
  await expect(sendButton(page)).toBeEnabled()
  await sendButton(page).click()
  await expectDelivered(page, 99, 'All ninety-nine.')
})

test('Pause holds both request legs and separates Core accounting from phone delivery', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  await sendButton(page).click()
  const packet = demo(page).getByTestId('coin-message-packet')
  for (const leg of ['to-core', 'to-phone']) {
    await expect(packet).toHaveAttribute('data-leg', leg)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    await page.waitForTimeout(1700)
    await expect(packet).toHaveAttribute('data-leg', leg)
    await expectBalances(
      page,
      leg === 'to-core' ? 99 : 98,
      leg === 'to-core' ? 1 : 2,
    )
    await expectNoReceipt(page)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
  }
  await expectDelivered(page)
})

test('switching to reduced motion during either leg settles the captured transfer once', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  for (const leg of ['to-core', 'to-phone']) {
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await amountInput(page).fill('25')
    await messageInput(page).fill('A single transfer.')
    await sendButton(page).click()
    await expect(demo(page).getByTestId('coin-message-packet')).toHaveAttribute(
      'data-leg',
      leg,
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expectDelivered(page, 25, 'A single transfer.')
    await sendButton(page).click({ force: true })
    await expectDelivered(page, 25, 'A single transfer.')
    await page
      .getByRole('button', { name: 'Replay animation', exact: true })
      .click()
    await expectFreshDemo(page)
  }
})
