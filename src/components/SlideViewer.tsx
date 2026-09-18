import { useState } from 'react'
import type { Chapter } from '../chapters'
import { Icon } from './Icon'
import { SlideCanvas } from './SlideCanvas'
import { PhaseControls } from './PhaseControls'
import { SlideScene } from './SlideScene'

type SlideViewerProps = {
  chapter: Chapter
  slideIndex: number
  goToSlide: (index: number) => void
}

export function SlideViewer({
  chapter,
  slideIndex,
  goToSlide,
}: SlideViewerProps) {
  const slide = chapter.slides[slideIndex]
  const sceneKey = `${chapter.id}-${slide.id}`
  const [playback, setPlayback] = useState({
    sceneKey,
    replay: 0,
    paused: false,
    phase: 0,
  })
  // A new scene starts playing while the navigation controls retain focus.
  if (playback.sceneKey !== sceneKey) {
    setPlayback({ sceneKey, replay: 0, paused: false, phase: 0 })
  }
  const { paused, replay, phase } = playback
  const playbackKey = `${sceneKey}-${phase}-${replay}`
  return (
    <section className="slideshow" aria-label={`${chapter.title} slideshow`}>
      <SlideCanvas>
        {slide.visual ? (
          <div
            className={`motion-stage${paused ? ' motion-paused' : ''}`}
            data-playback-key={playbackKey}
          >
            <SlideScene
              key={playbackKey}
              slide={slide}
              phase={phase}
              paused={paused}
            />
          </div>
        ) : (
          <div className="slide-content">
            <h2 className="slide-number">Slide {slideIndex + 1}</h2>
          </div>
        )}
      </SlideCanvas>
      <p className="sr-only" role="status" aria-atomic="true">
        Slide {slideIndex + 1} of {chapter.slides.length}: {slide.title}{' '}
        {slide.sentence}
      </p>

      {slide.phases && (
        <PhaseControls
          phases={slide.phases}
          phase={phase}
          onChange={(nextPhase) =>
            setPlayback((value) => ({
              ...value,
              phase: nextPhase,
              paused: false,
              replay: value.replay + 1,
            }))
          }
        />
      )}

      <div className="presentation-tools">
        <label className="slide-picker">
          <span className="sr-only">Jump to slide</span>
          <select
            aria-label="Jump to slide"
            value={slideIndex}
            onChange={(event) => goToSlide(Number(event.target.value))}
          >
            {chapter.slides.map((item, index) => (
              <option key={item.id} value={index}>
                {String(index + 1).padStart(2, '0')} / {item.title}
              </option>
            ))}
          </select>
        </label>
        {slide.visual && (
          <div className="playback-controls">
            <button
              type="button"
              className="tool-button"
              aria-label="Replay animation"
              onClick={() => {
                setPlayback((value) => ({
                  ...value,
                  replay: value.replay + 1,
                  paused: false,
                }))
              }}
            >
              <Icon name="replay" size={16} />
              <span>Replay</span>
            </button>
            <button
              type="button"
              className="tool-button"
              aria-label={paused ? 'Resume animation' : 'Pause animation'}
              aria-pressed={paused}
              onClick={() =>
                setPlayback((value) => ({ ...value, paused: !value.paused }))
              }
            >
              <Icon name={paused ? 'play' : 'pause'} size={16} />
              <span>{paused ? 'Resume' : 'Pause'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="slide-controls">
        <button
          className="arrow-button previous"
          onClick={() => goToSlide(slideIndex - 1)}
          disabled={slideIndex === 0}
          aria-label="Previous slide"
        >
          <Icon name="arrow-left" />
          <span>Previous</span>
        </button>
        <nav className="slide-progress" aria-label="Slide navigation">
          {chapter.slides.map((item, index) => (
            <button
              key={item.id}
              className={`progress-step${index === slideIndex ? ' current' : ''}${index < slideIndex ? ' visited' : ''}`}
              onClick={() => goToSlide(index)}
              aria-current={index === slideIndex ? 'step' : undefined}
              aria-label={`Go to slide ${index + 1}: ${item.title}`}
              title={item.title}
            >
              <span />
            </button>
          ))}
        </nav>
        <button
          className="arrow-button next"
          onClick={() => goToSlide(slideIndex + 1)}
          disabled={slideIndex === chapter.slides.length - 1}
          aria-label="Next slide"
        >
          <span>Next</span>
          <Icon name="arrow-right" />
        </button>
      </div>

      <div className="slide-bottomline">
        <span>
          Slide <strong>{slideIndex + 1}</strong> of {chapter.slides.length}
        </span>
        <span className="keyboard-hint">
          Use <kbd>←</kbd> <kbd>→</kbd> to navigate
        </span>
      </div>
    </section>
  )
}
