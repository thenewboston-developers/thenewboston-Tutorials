import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const chapterPath = '/#/chapters/core-architecture'
const offerLegs = ['offer-to-core', 'offer-to-carla'] as const
const paymentLegs = [
  'coffee-to-core',
  'coffee-to-bucky',
  'bonsai-to-core',
  'bonsai-to-carla',
] as const

function demo(page: Page) {
  return page.getByTestId('native-trade-demo')
}
function sendOffer(page: Page) {
  return demo(page)
    .getByTestId('bucky-phone')
    .getByRole('button', { name: 'Send offer', exact: true })
}
function acceptOffer(page: Page) {
  return demo(page)
    .getByTestId('carla-phone')
    .getByRole('button', { name: 'Accept', exact: true })
}
function packet(page: Page) {
  return demo(page).getByTestId('native-trade-packet')
}
function coffeeReceipt(page: Page) {
  return demo(page).getByTestId('native-trade-coffee-receipt')
}
function bonsaiReceipt(page: Page) {
  return demo(page).getByTestId('native-trade-bonsai-receipt')
}
async function phase(page: Page, value: string) {
  await expect(demo(page)).toHaveAttribute('data-phase', value, {
    timeout: 8000,
  })
}
async function noReceipts(page: Page) {
  await expect(coffeeReceipt(page)).toHaveCount(0)
  await expect(bonsaiReceipt(page)).toHaveCount(0)
}
async function blankCarlaScreen(page: Page) {
  const phone = demo(page).getByTestId('carla-phone')
  const screen = phone.locator('.architecture-phone-screen')
  await expect(screen).toBeEmpty()
  await expect(phone.getByRole('button')).toHaveCount(0)
  await expect(screen.locator('input, textarea, svg, img')).toHaveCount(0)
}
async function fresh(page: Page) {
  await phase(page, 'ready')
  await expect(sendOffer(page)).toBeEnabled()
  await blankCarlaScreen(page)
  await expect(packet(page)).toHaveCount(0)
  await noReceipts(page)
}
async function openDemo(page: Page) {
  await page.goto(`${chapterPath}/14`)
  await expect(
    page.getByRole('group', {
      name: 'A trade between Bonsai and Coffee coins',
      exact: true,
    }),
  ).toBeVisible()
  await expect(demo(page)).toBeVisible()
  await expect(demo(page).getByTestId('bucky-phone')).toBeVisible()
  await expect(demo(page).getByTestId('carla-phone')).toBeVisible()
  await fresh(page)
}
async function waitingForAccept(page: Page) {
  await phase(page, 'awaiting-accept')
  await expect(sendOffer(page)).toBeDisabled()
  await expect(acceptOffer(page)).toBeEnabled()
  await expect(
    demo(page).getByRole('button', { name: 'Decline', exact: true }),
  ).toBeDisabled()
  await expect(packet(page)).toHaveCount(0)
  await noReceipts(page)
}
async function complete(page: Page) {
  await phase(page, 'complete')
  await expect(coffeeReceipt(page)).toBeVisible()
  await expect(coffeeReceipt(page)).toContainText(/\+20\s*Coffee/)
  await expect(bonsaiReceipt(page)).toBeVisible()
  await expect(bonsaiReceipt(page)).toContainText(/\+1\s*Bonsai/)
  await expect(coffeeReceipt(page)).toHaveCount(1)
  await expect(bonsaiReceipt(page)).toHaveCount(1)
  await expect(sendOffer(page)).toBeDisabled()
  await expect(acceptOffer(page)).toBeDisabled()
  await expect(packet(page)).toHaveCount(0)
}
async function repeatActions(page: Page) {
  for (const button of [sendOffer(page), acceptOffer(page)]) {
    await button.click({ force: true })
    await button.press('Enter')
    await button.press('Space')
  }
}
async function replay(page: Page) {
  await page
    .getByRole('button', { name: 'Replay animation', exact: true })
    .click()
  await fresh(page)
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`offer waits for acceptance, then Coffee arrives before the automatic Bonsai return (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    await page.waitForTimeout(1700)
    await fresh(page)
    await sendOffer(page).click()
    if (reducedMotion === 'no-preference') {
      await sendOffer(page).click({ force: true })
      await sendOffer(page).press('Enter')
      await sendOffer(page).press('Space')
      for (const leg of offerLegs) {
        await phase(page, leg)
        await expect(packet(page)).toHaveAttribute('data-leg', leg)
        await blankCarlaScreen(page)
        await noReceipts(page)
      }
    }
    await waitingForAccept(page)
    // Longer than both offer legs: arrival never accepts on Carla's behalf.
    await page.waitForTimeout(3100)
    await waitingForAccept(page)
    await acceptOffer(page).click()
    if (reducedMotion === 'no-preference') {
      await repeatActions(page)
      for (const leg of paymentLegs) {
        await phase(page, leg)
        await expect(packet(page)).toHaveAttribute('data-leg', leg)
        await expect(acceptOffer(page)).toBeDisabled()
        await expect(bonsaiReceipt(page)).toHaveCount(0)
        if (leg.startsWith('coffee')) {
          await expect(coffeeReceipt(page)).toHaveCount(0)
        } else {
          await expect(coffeeReceipt(page)).toBeVisible()
          await expect(coffeeReceipt(page)).toContainText(/\+20\s*Coffee/)
        }
      }
    }
    await complete(page)
    await repeatActions(page)
    await page.waitForTimeout(250)
    await complete(page)
  })

  test(`Replay, re-entry, and reload cancel a trade and restore its unsent offer (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openDemo(page)
    for (const reset of ['replay', 're-entry', 'reload']) {
      await sendOffer(page).click()
      if (reset === 'replay' && reducedMotion === 'no-preference') {
        await phase(page, 'offer-to-carla')
      } else {
        await waitingForAccept(page)
        await acceptOffer(page).click()
        if (reducedMotion === 'no-preference') {
          await phase(page, 'bonsai-to-core')
          await expect(coffeeReceipt(page)).toBeVisible()
        } else {
          await complete(page)
        }
      }
      if (reset === 'replay') {
        await replay(page)
      } else if (reset === 're-entry') {
        await page
          .getByRole('button', { name: 'Previous slide', exact: true })
          .click()
        await expect(page).toHaveURL(new RegExp(`${chapterPath}/13$`))
        await expect(
          page.locator('.architecture-scene').getByText('Coffee Core', {
            exact: true,
          }),
        ).toBeVisible()
        await page
          .getByRole('button', { name: 'Next slide', exact: true })
          .click()
      } else {
        await page.reload()
      }
      await fresh(page)
      // Discarded travel must not deliver into the new scene instance.
      await page.waitForTimeout(reducedMotion === 'no-preference' ? 3100 : 200)
      await fresh(page)
    }
  })
}

test('keyboard offers and accepts exactly once, retaining the manual decision in reduced motion', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await openDemo(page)
  for (const key of ['Enter', 'Space']) {
    await sendOffer(page).focus()
    await page.keyboard.press(key)
    await waitingForAccept(page)
    await sendOffer(page).press(key)
    await waitingForAccept(page)
    await acceptOffer(page).focus()
    await page.keyboard.press(key)
    await complete(page)
    await repeatActions(page)
    await complete(page)
    await replay(page)
  }
})

test('Pause holds each offer and payment leg without premature recipient receipts', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await sendOffer(page).click()
  for (const leg of [...offerLegs, ...paymentLegs]) {
    if (leg === 'coffee-to-core') {
      await waitingForAccept(page)
      await acceptOffer(page).click()
    }
    await phase(page, leg)
    if (leg !== 'offer-to-core') {
      await page
        .getByRole('button', { name: 'Pause animation', exact: true })
        .click()
    }
    await page.waitForTimeout(1600)
    await phase(page, leg)
    await expect(packet(page)).toHaveAttribute('data-leg', leg)
    await expect(bonsaiReceipt(page)).toHaveCount(0)
    if (leg.startsWith('offer')) await blankCarlaScreen(page)
    if (leg.startsWith('bonsai')) {
      await expect(coffeeReceipt(page)).toBeVisible()
    } else {
      await expect(coffeeReceipt(page)).toHaveCount(0)
    }
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
  }
  await complete(page)
})

test('a reduced-motion preference change finishes the active segment without accepting the offer', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openDemo(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await fresh(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await sendOffer(page).click()
  await phase(page, 'offer-to-carla')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await waitingForAccept(page)
  await page.waitForTimeout(1700)
  await waitingForAccept(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await waitingForAccept(page)
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await acceptOffer(page).click()
  await phase(page, 'coffee-to-bucky')
  await noReceipts(page)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await complete(page)
  await repeatActions(page)
  await complete(page)
})
