import { useRef } from 'react'
import { ChapterSidebar } from './components/ChapterSidebar'
import { SlideViewer } from './components/SlideViewer'
import { useSlideshow } from './hooks/useSlideshow'

export default function App() {
  const { chapter, slideIndex, goToSlide } = useSlideshow()
  const mainRef = useRef<HTMLElement>(null)

  return (
    <div className="app-shell">
      <button
        type="button"
        className="skip-link"
        onClick={() => mainRef.current?.focus()}
      >
        Skip to slideshow
      </button>
      <ChapterSidebar
        activeChapterId={chapter.id}
        slide={chapter.slides[slideIndex]}
        slideNumber={slideIndex + 1}
      />
      <main
        ref={mainRef}
        id="main-content"
        className="main-content"
        tabIndex={-1}
      >
        <div className="lesson">
          <h1 className="sr-only">{chapter.title}</h1>
          <SlideViewer
            chapter={chapter}
            slideIndex={slideIndex}
            goToSlide={goToSlide}
          />
        </div>
      </main>
    </div>
  )
}
