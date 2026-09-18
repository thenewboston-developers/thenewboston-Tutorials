import { useEffect, useSyncExternalStore } from 'react'
import { chapters } from '../chapters'

function subscribe(onChange: () => void) {
  window.addEventListener('hashchange', onChange)
  return () => window.removeEventListener('hashchange', onChange)
}

function getHash() {
  return window.location.hash
}

export function chapterUrl(chapterId: string, slideIndex = 0) {
  return `#/chapters/${chapterId}/${slideIndex + 1}`
}

export function useSlideshow() {
  const hash = useSyncExternalStore(subscribe, getHash)
  const match = /^#\/chapters\/([^/]+)(?:\/(\d+))?$/.exec(hash)
  const chapter = chapters.find((item) => item.id === match?.[1]) ?? chapters[0]
  const requestedSlide = Number(match?.[2] ?? 1)
  const slideIndex = Math.min(
    Math.max(requestedSlide - 1, 0),
    chapter.slides.length - 1,
  )

  function goToSlide(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), chapter.slides.length - 1)
    window.location.hash = chapterUrl(chapter.id, nextIndex)
  }

  useEffect(() => {
    document.title = `${chapter.title} · Slide ${slideIndex + 1} · thenewboston Tutorials`
  }, [chapter.title, slideIndex])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return
      const target = event.target
      if (
        target instanceof HTMLElement &&
        target.closest(
          'input, textarea, select, [contenteditable="true"], [role="textbox"]',
        )
      )
        return

      let nextIndex: number
      switch (event.key) {
        case 'ArrowLeft':
          nextIndex = slideIndex - 1
          break
        case 'ArrowRight':
          nextIndex = slideIndex + 1
          break
        case 'Home':
          nextIndex = 0
          break
        case 'End':
          nextIndex = chapter.slides.length - 1
          break
        default:
          return
      }

      event.preventDefault()
      nextIndex = Math.min(Math.max(nextIndex, 0), chapter.slides.length - 1)
      window.location.hash = chapterUrl(chapter.id, nextIndex)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [chapter.id, chapter.slides.length, slideIndex])

  return { chapter, slideIndex, goToSlide }
}
