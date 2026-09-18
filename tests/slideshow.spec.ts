import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const chapterPath = '/#/chapters/core-architecture'
const slideCount = 10

function chapterLink(page: Page) {
  return page
    .getByRole('navigation', { name: 'Chapters', exact: true })
    .getByRole('link')
}

async function expectSlide(page: Page, number: number) {
  await expect(
    page.getByRole('region', {
      name: 'Core Architecture slideshow',
      exact: true,
    }),
  ).toBeVisible()
  await expect(
    page.getByText(`Slide ${number} of ${slideCount}`, { exact: true }),
  ).toBeVisible()
  const progress = page.getByRole('navigation', {
    name: 'Slide navigation',
    exact: true,
  })
  await expect(progress.getByRole('button')).toHaveCount(slideCount)
  await expect(progress.getByRole('button').nth(number - 1)).toHaveAttribute(
    'aria-current',
    'step',
  )
  await expect(progress.locator('[aria-current="step"]')).toHaveCount(1)
  await expect(page.locator('.architecture-scene')).toBeVisible()
}

async function expectCanvasFits(page: Page) {
  const frame = page.locator('.slide-frame')
  const canvas = page.locator('.slide-card')
  // ResizeObserver must scale the authored 2560×1440 canvas to its frame.
  await expect
    .poll(async () => {
      const frameBox = await frame.boundingBox()
      const canvasBox = await canvas.boundingBox()
      return Boolean(
        frameBox &&
        canvasBox &&
        frameBox.width > 0 &&
        Math.abs(frameBox.width - canvasBox.width) < 1 &&
        Math.abs(frameBox.height - canvasBox.height) < 1,
      )
    })
    .toBe(true)
  const frameBox = await frame.boundingBox()
  const canvasBox = await canvas.boundingBox()
  const controlsBox = await page.locator('.slide-controls').boundingBox()
  const viewport = page.viewportSize()
  if (!frameBox || !canvasBox || !controlsBox || !viewport) {
    throw new Error('The slide frame or navigation controls are missing')
  }
  expect(frameBox.width / frameBox.height).toBeCloseTo(16 / 9, 3)
  expect(canvasBox.width / canvasBox.height).toBeCloseTo(16 / 9, 3)
  expect(canvasBox.x).toBeCloseTo(frameBox.x, 1)
  expect(canvasBox.y).toBeCloseTo(frameBox.y, 1)
  expect(frameBox.x).toBeGreaterThanOrEqual(0)
  expect(frameBox.x + frameBox.width).toBeLessThanOrEqual(viewport.width + 1)
  expect(controlsBox.y).toBeGreaterThanOrEqual(frameBox.y + frameBox.height)
  expect(controlsBox.x).toBeGreaterThanOrEqual(0)
  expect(controlsBox.x + controlsBox.width).toBeLessThanOrEqual(
    viewport.width + 1,
  )
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true)
  await expect(chapterLink(page)).toBeVisible()
}

test('opens the sole Chapter 1 with thenewboston branding', async ({
  page,
}) => {
  await page.goto('/')
  await expectSlide(page, 1)
  await expect(chapterLink(page)).toHaveCount(1)
  await expect(chapterLink(page).locator('.chapter-number')).toHaveText('01')
  await expect(chapterLink(page)).toContainText('Core Architecture')
  await expect(chapterLink(page)).toHaveAttribute(
    'href',
    '#/chapters/core-architecture/1',
  )
  await expect(chapterLink(page)).toHaveAttribute('aria-current', 'page')
  await expect(page).toHaveTitle(
    /Core Architecture.*Slide 1.*thenewboston Tutorials/,
  )
  await expect(page).not.toHaveTitle(/DBDC/i)
  await expect(page.locator('body')).not.toContainText(/DBDC/)
  await expect(
    page.getByRole('button', { name: 'Previous slide', exact: true }),
  ).toBeDisabled()
  await expect(
    page.getByRole('button', { name: 'Next slide', exact: true }),
  ).toBeEnabled()
})

test('invalid and old chapter routes fall back to Chapter 1, and slide numbers are bounded', async ({
  page,
}) => {
  const errors: string[] = []
  page.on('pageerror', (error) => errors.push(error.message))
  for (const [path, number] of [
    ['/#/not-a-route', 1],
    ['/#/chapters/unknown/1', 1],
    ['/#/chapters/the-vision/1', 1],
    [`${chapterPath}/not-a-number`, 1],
    [`${chapterPath}/0`, 1],
    [`${chapterPath}/999`, slideCount],
  ] as const) {
    await page.goto(path)
    await expectSlide(page, number)
    await expect(chapterLink(page)).toHaveCount(1)
    await expect(chapterLink(page).locator('.chapter-number')).toHaveText('01')
    await chapterLink(page).click()
    await expectSlide(page, 1)
    await expect(page).toHaveURL(new RegExp(`${chapterPath}/1$`))
  }
  expect(errors).toEqual([])
})

for (const reducedMotion of ['no-preference', 'reduce'] as const) {
  test(`all ten direct routes render a scaled canvas without runtime errors (${reducedMotion})`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion })
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    for (let number = 1; number <= slideCount; number += 1) {
      await page.goto(`${chapterPath}/${number}`)
      await expectSlide(page, number)
      await expect(page).toHaveTitle(
        new RegExp(
          `Core Architecture.*Slide ${number}.*thenewboston Tutorials`,
        ),
      )
      await expect(
        page.getByLabel('Jump to slide', { exact: true }),
      ).toHaveValue(String(number - 1))
      await expect(
        page.getByRole('region', { name: 'Animation phase controls' }),
      ).toHaveCount(0)
      await expect(page.locator('.slide-number')).toHaveCount(0)
      await expect(
        page.getByRole('region', { name: 'Presenter notes' }),
      ).toBeVisible()
      await expectCanvasFits(page)
    }
    await page.reload()
    await expectSlide(page, slideCount)
    await expect(page).toHaveURL(new RegExp(`${chapterPath}/${slideCount}$`))
    expect(errors).toEqual([])
  })
}

test('the picker and progress controls select slides, and the chapter link returns to slide 1', async ({
  page,
}) => {
  await page.goto(`${chapterPath}/1`)
  const selector = page.getByLabel('Jump to slide', { exact: true })
  await expect(selector.locator('option')).toHaveCount(slideCount)
  for (let index = 1; index < slideCount; index += 1) {
    await selector.selectOption(String(index))
    await expectSlide(page, index + 1)
    await expect(page).toHaveURL(new RegExp(`${chapterPath}/${index + 1}$`))
  }
  await page
    .getByRole('navigation', { name: 'Slide navigation', exact: true })
    .getByRole('button')
    .nth(3)
    .click()
  await expectSlide(page, 4)
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/4$`))
  await chapterLink(page).click()
  await expectSlide(page, 1)
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/1$`))
})

test('resizing preserves the 16:9 canvas and keeps navigation outside it', async ({
  page,
}) => {
  await page.goto(`${chapterPath}/${slideCount}`)
  for (const viewport of [
    { width: 390, height: 844 },
    { width: 1440, height: 1000 },
    { width: 2560, height: 1440 },
    { width: 390, height: 844 },
  ]) {
    await page.setViewportSize(viewport)
    await expectCanvasFits(page)
    await expectSlide(page, slideCount)
  }
})

test('playback controls keep the route and reset on Replay or a new slide', async ({
  page,
}) => {
  await page.goto(`${chapterPath}/4`)
  const stage = page.locator('.motion-stage')
  const originalKey = await stage.getAttribute('data-playback-key')
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  await expect(stage).toHaveClass(/motion-paused/)
  await expect(
    page.getByRole('button', { name: 'Resume animation', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true')
  await page
    .getByRole('button', { name: 'Replay animation', exact: true })
    .click()
  await expect(stage).not.toHaveAttribute(
    'data-playback-key',
    originalKey ?? '',
  )
  await expect(stage).not.toHaveClass(/motion-paused/)
  await expect(page).toHaveURL(new RegExp(`${chapterPath}/4$`))
  await expectSlide(page, 4)
  await page
    .getByRole('button', { name: 'Pause animation', exact: true })
    .click()
  const next = page.getByRole('button', { name: 'Next slide', exact: true })
  await next.click()
  await expectSlide(page, 5)
  await expect(
    page.getByRole('button', { name: 'Pause animation', exact: true }),
  ).toHaveAttribute('aria-pressed', 'false')
  await expect(stage).not.toHaveClass(/motion-paused/)
  await expect(next).toBeFocused()
})
