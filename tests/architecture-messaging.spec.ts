import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

type Person = 'bucky' | 'ty'
const chapterPath = '/#/chapters/core-architecture'
const messages = { bucky: 'Hello, Ty', ty: 'Hey Dad' } as const

function sendButton(page: Page, person: Person) {
  return page
    .getByTestId('messaging-demo')
    .getByTestId(`${person}-phone`)
    .getByRole('button', { name: 'Send', exact: true })
}

function composer(page: Page, person: Person) {
  return page.getByLabel(
    person === 'bucky' ? 'Message to Ty' : 'Message to Bucky',
    {
      exact: true,
    },
  )
}

function received(page: Page, person: Person) {
  return page.getByTestId(`chat-${person}-received`)
}

function recipient(sender: Person): Person {
  return sender === 'bucky' ? 'ty' : 'bucky'
}

async function openMessaging(page: Page) {
  await page.goto(`${chapterPath}/6`)
  await expect(page.getByTestId('messaging-demo')).toBeVisible()
}

async function expectFreshMessaging(page: Page) {
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/6$`))
  await expect(composer(page, 'bucky')).toHaveValue(messages.bucky)
  await expect(composer(page, 'ty')).toHaveValue('')
  await expect(sendButton(page, 'bucky')).toBeEnabled()
  await expect(sendButton(page, 'ty')).toHaveAttribute('aria-disabled', 'true')
  await expect(page.getByTestId('message-packet')).toHaveCount(0)
  await expect(page.getByTestId('reply-delay')).toHaveCount(0)
  await expect(page.getByTestId('reply-typing')).toHaveCount(0)
  await expect(received(page, 'bucky')).toHaveCount(0)
  await expect(received(page, 'ty')).toHaveCount(0)
}

async function expectDelivered(page: Page, sender: Person) {
  await expect(received(page, recipient(sender))).toHaveText(messages[sender])
  await expect(received(page, recipient(sender))).toBeVisible()
  await expect(page.getByTestId('message-packet')).toHaveCount(0)
}

async function expectBothDisabled(page: Page) {
  await expect(sendButton(page, 'bucky')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
  await expect(sendButton(page, 'ty')).toHaveAttribute('aria-disabled', 'true')
}

async function expectReplyReady(page: Page) {
  await expect(composer(page, 'ty')).toHaveValue(messages.ty, { timeout: 7000 })
  await expect(sendButton(page, 'ty')).toBeEnabled()
  await expect(sendButton(page, 'bucky')).toHaveAttribute(
    'aria-disabled',
    'true',
  )
  await expect(received(page, 'bucky')).toHaveCount(0)
  await expect(page.getByTestId('message-packet')).toHaveCount(0)
  await expect(page.getByTestId('reply-delay')).toHaveCount(0)
  await expect(page.getByTestId('reply-typing')).toHaveCount(0)
}

async function expectConversationComplete(page: Page) {
  await expectDelivered(page, 'ty')
  await expect(received(page, 'ty')).toHaveText(messages.bucky)
  await expect(composer(page, 'bucky')).toHaveValue('')
  await expect(composer(page, 'ty')).toHaveValue('')
  await expectBothDisabled(page)
}

async function waitForFirstReplyCharacter(page: Page) {
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLTextAreaElement>(
        'textarea[aria-label="Message to Bucky"]',
      )?.value === 'H',
    undefined,
    { timeout: 7000 },
  )
}

async function resetMessaging(page: Page, reset: string) {
  if (reset === 'replay') {
    await page
      .getByRole('button', { name: 'Replay animation', exact: true })
      .click()
  } else if (reset === 're-entry') {
    await page
      .getByRole('button', { name: 'Previous slide', exact: true })
      .click()
    await expect(page.locator('.architecture-scene')).toContainText('Data only')
    await page.getByRole('button', { name: 'Next slide', exact: true }).click()
  } else {
    await page.reload()
  }
}

function observeReplyTiming(page: Page) {
  return page.evaluate(
    () =>
      new Promise<{
        arrival: number | null
        samples: { value: string; time: number; disabled: boolean }[]
      }>((resolve) => {
        let arrival: number | null = null
        const samples: { value: string; time: number; disabled: boolean }[] = []
        let frame = 0
        const timeout = window.setTimeout(() => {
          cancelAnimationFrame(frame)
          resolve({ arrival, samples })
        }, 10000)
        function sample(now: number) {
          if (
            arrival === null &&
            document.querySelector('[data-testid="chat-ty-received"]')
          ) {
            arrival = now
          }
          const draft = document.querySelector<HTMLTextAreaElement>(
            'textarea[aria-label="Message to Bucky"]',
          )
          if (draft?.value && samples.at(-1)?.value !== draft.value) {
            samples.push({
              value: draft.value,
              time: now,
              disabled:
                document
                  .querySelector('[data-testid="ty-phone"] button')
                  ?.getAttribute('aria-disabled') === 'true',
            })
          }
          if (draft?.value === 'Hey Dad') {
            window.clearTimeout(timeout)
            resolve({ arrival, samples })
            return
          }
          frame = requestAnimationFrame(sample)
        }
        frame = requestAnimationFrame(sample)
      }),
  )
}

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`Send clears the draft, receipt starts a two-second delay then gradual typing, and Ty waits for a manual send (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openMessaging(page)
    await expectFreshMessaging(page)
    const demo = page.getByTestId('messaging-demo')
    await expect(demo.getByRole('table')).toHaveCount(0)
    await expect(
      demo.getByLabel('Recipient on Bucky’s phone', { exact: true }),
    ).toHaveValue('Ty')
    await expect(
      demo.getByLabel('Recipient on Ty’s phone', { exact: true }),
    ).toHaveValue('Bucky')
    await expect(demo.getByLabel('Amount', { exact: true })).toHaveCount(0)
    for (const person of ['bucky', 'ty'] as const) {
      await expect(composer(page, person)).toHaveJSProperty('readOnly', true)
    }
    await sendButton(page, 'ty').click({ force: true })
    // Mounting and an empty Send cannot begin either message or the reply delay.
    await page.waitForTimeout(3000)
    await expectFreshMessaging(page)

    const replyTiming = observeReplyTiming(page)
    await sendButton(page, 'bucky').click()
    await expect(composer(page, 'bucky')).toHaveValue('')
    await expect(composer(page, 'ty')).toHaveValue('')
    await expectBothDisabled(page)
    if (reducedMotion === 'no-preference') {
      const packet = page.getByTestId('message-packet')
      for (const leg of ['to-core', 'to-phone']) {
        await expect(packet).toHaveAttribute('data-sender', 'bucky')
        await expect(packet).toHaveAttribute('data-leg', leg)
        await expect(received(page, 'ty')).toHaveCount(0)
        await expect(composer(page, 'ty')).toHaveValue('')
        await expect(page.getByTestId('reply-delay')).toHaveCount(0)
      }
    }
    await expectDelivered(page, 'bucky')
    await expect(composer(page, 'ty')).toHaveValue('')
    await expect(page.getByTestId('reply-delay')).toHaveCount(1)
    const timing = await replyTiming
    expect(timing.arrival).not.toBeNull()
    expect(timing.samples.map(({ value }) => value)).toEqual([
      'H',
      'He',
      'Hey',
      'Hey ',
      'Hey D',
      'Hey Da',
      'Hey Dad',
    ])
    // The first character follows receipt by 2 s; later characters take 160 ms.
    // Animation-frame sampling allows a small margin for rendering and scheduling.
    const firstCharacterDelay = timing.samples[0].time - timing.arrival!
    expect(firstCharacterDelay).toBeGreaterThanOrEqual(1850)
    expect(firstCharacterDelay).toBeLessThanOrEqual(2500)
    for (let index = 1; index < timing.samples.length; index += 1) {
      const characterDelay =
        timing.samples[index].time - timing.samples[index - 1].time
      expect(characterDelay).toBeGreaterThanOrEqual(110)
      expect(characterDelay).toBeLessThanOrEqual(320)
    }
    expect(timing.samples.slice(0, -1).every(({ disabled }) => disabled)).toBe(
      true,
    )
    expect(timing.samples.at(-1)?.disabled).toBe(false)
    await expectReplyReady(page)

    // A ready reply remains a draft, even longer than a complete packet journey.
    await page.waitForTimeout(3000)
    await expectReplyReady(page)
    await sendButton(page, 'ty').click()
    await expect(composer(page, 'ty')).toHaveValue('')
    await expectBothDisabled(page)
    if (reducedMotion === 'no-preference') {
      for (const leg of ['to-core', 'to-phone']) {
        await expect(page.getByTestId('message-packet')).toHaveAttribute(
          'data-sender',
          'ty',
        )
        await expect(page.getByTestId('message-packet')).toHaveAttribute(
          'data-leg',
          leg,
        )
        await expect(received(page, 'bucky')).toHaveCount(0)
      }
    }
    await expectConversationComplete(page)
    for (const person of ['bucky', 'ty'] as const) {
      const messageId = await received(page, person).getAttribute(
        'data-message-id',
      )
      await sendButton(page, person).click({ force: true })
      await sendButton(page, person).press('Enter')
      await sendButton(page, person).press('Space')
      await expect(received(page, person)).toHaveAttribute(
        'data-message-id',
        messageId!,
      )
      await expect(received(page, person)).toHaveCount(1)
    }
    await expectConversationComplete(page)
  })

  test(`Enter and Space send once, while empty and in-flight activations are guarded (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openMessaging(page)
    await sendButton(page, 'ty').focus()
    await page.keyboard.press('Space')
    await expectFreshMessaging(page)
    for (const [sender, key] of [
      ['bucky', 'Enter'],
      ['ty', 'Space'],
    ] as const) {
      if (sender === 'ty') await expectReplyReady(page)
      const send = sendButton(page, sender)
      await send.focus()
      await page.keyboard.press(key)
      await expect(send).toBeFocused()
      await expect(composer(page, sender)).toHaveValue('')
      await expectBothDisabled(page)
      await page.keyboard.down(key)
      await page.keyboard.down(key)
      await page.keyboard.up(key)
      await send.click({ force: true })
      await sendButton(page, recipient(sender)).click({ force: true })
      if (reducedMotion === 'no-preference') {
        await expect(page.getByTestId('message-packet')).toHaveCount(1)
        await expect(page.getByTestId('message-packet')).toHaveAttribute(
          'data-sender',
          sender,
        )
        await expect(received(page, recipient(sender))).toHaveCount(0)
      }
      await expectDelivered(page, sender)
      await expect(received(page, recipient(sender))).toHaveCount(1)
    }
    await expectConversationComplete(page)
  })

  test(`Pause holds the reply delay, including with reduced travel (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openMessaging(page)
    await sendButton(page, 'bucky').click()
    await expectDelivered(page, 'bucky')
    await expect(page.getByTestId('reply-delay')).toHaveCount(1)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    await page.waitForTimeout(2400)
    await expect(composer(page, 'ty')).toHaveValue('')
    await expectBothDisabled(page)
    await expect(received(page, 'bucky')).toHaveCount(0)
    await expect(page.getByTestId('reply-delay')).toHaveCount(1)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
    await expectReplyReady(page)
  })

  test(`Pause holds partial typing and partial replies cannot be sent (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openMessaging(page)
    await sendButton(page, 'bucky').click()
    await waitForFirstReplyCharacter(page)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    const partialReply = await composer(page, 'ty').inputValue()
    expect(partialReply.length).toBeGreaterThan(0)
    expect(partialReply.length).toBeLessThan(messages.ty.length)
    expect(messages.ty.startsWith(partialReply)).toBe(true)
    await expect(page.getByTestId('reply-delay')).toHaveCount(0)
    await expect(page.getByTestId('reply-typing')).toHaveCount(1)
    await expectBothDisabled(page)
    await sendButton(page, 'ty').click({ force: true })
    await sendButton(page, 'ty').press('Enter')
    await sendButton(page, 'ty').press('Space')
    // Longer than all six remaining character intervals: Pause must stop typing.
    await page.waitForTimeout(1200)
    await expect(composer(page, 'ty')).toHaveValue(partialReply)
    await expect(page.getByTestId('message-packet')).toHaveCount(0)
    await expect(received(page, 'bucky')).toHaveCount(0)
    await expectBothDisabled(page)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
    await expectReplyReady(page)
    await sendButton(page, 'ty').click()
    await expect(composer(page, 'ty')).toHaveValue('')
    await expectConversationComplete(page)
  })

  test(`Replay, slide re-entry, and reload cancel a pending reply delay (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openMessaging(page)
    for (const reset of ['replay', 're-entry', 'reload']) {
      await sendButton(page, 'bucky').click()
      await expectDelivered(page, 'bucky')
      await expect(page.getByTestId('reply-delay')).toHaveCount(1)
      await resetMessaging(page, reset)
      await expectFreshMessaging(page)
      // An old delay must not populate the newly mounted conversation.
      await page.waitForTimeout(2300)
      await expectFreshMessaging(page)
    }
  })

  test(`Replay, slide re-entry, and reload discard partial typing (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    await openMessaging(page)
    for (const reset of ['replay', 're-entry', 'reload']) {
      await sendButton(page, 'bucky').click()
      await waitForFirstReplyCharacter(page)
      await resetMessaging(page, reset)
      await expectFreshMessaging(page)
      // A discarded typing clock must never write into the fresh conversation.
      await page.waitForTimeout(1200)
      await expectFreshMessaging(page)
    }
  })
}

test('Pause holds both travel legs before a message arrives', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openMessaging(page)
  await sendButton(page, 'bucky').click()
  const packet = page.getByTestId('message-packet')
  for (const leg of ['to-core', 'to-phone']) {
    await expect(packet).toHaveAttribute('data-leg', leg)
    await page
      .getByRole('button', { name: 'Pause animation', exact: true })
      .click()
    await page.waitForTimeout(1700)
    await expect(packet).toHaveAttribute('data-leg', leg)
    await expect(received(page, 'ty')).toHaveCount(0)
    await expect(composer(page, 'ty')).toHaveValue('')
    await expect(page.getByTestId('reply-delay')).toHaveCount(0)
    await expectBothDisabled(page)
    await page
      .getByRole('button', { name: 'Resume animation', exact: true })
      .click()
  }
  await expectDelivered(page, 'bucky')
})

test('Replay cancels a traveling message and restores the draft after a completed conversation', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openMessaging(page)
  await sendButton(page, 'bucky').click()
  await expect(page.getByTestId('message-packet')).toHaveAttribute(
    'data-leg',
    'to-phone',
  )
  await page
    .getByRole('button', { name: 'Replay animation', exact: true })
    .click()
  await expectFreshMessaging(page)
  await page.waitForTimeout(3000)
  await expectFreshMessaging(page)
  await sendButton(page, 'bucky').click()
  await expectReplyReady(page)
  await sendButton(page, 'ty').click()
  await expectConversationComplete(page)
  await page
    .getByRole('button', { name: 'Replay animation', exact: true })
    .click()
  await expectFreshMessaging(page)
})

test('switching to reduced motion settles either travel leg once without skipping the reply delay', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' })
  await openMessaging(page)
  for (const [sender, leg] of [
    ['bucky', 'to-core'],
    ['ty', 'to-phone'],
  ] as const) {
    if (sender === 'ty') await expectReplyReady(page)
    await page.emulateMedia({ reducedMotion: 'no-preference' })
    await sendButton(page, sender).click()
    await expect(page.getByTestId('message-packet')).toHaveAttribute(
      'data-leg',
      leg,
    )
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await expectDelivered(page, sender)
    await expect(received(page, recipient(sender))).toHaveCount(1)
    if (sender === 'bucky') {
      await expect(composer(page, 'ty')).toHaveValue('')
      await expect(page.getByTestId('reply-delay')).toHaveCount(1)
      await page.waitForTimeout(1000)
      await expect(composer(page, 'ty')).toHaveValue('')
    }
  }
  await expectConversationComplete(page)
})
