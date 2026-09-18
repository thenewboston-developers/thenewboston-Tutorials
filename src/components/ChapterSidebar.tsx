import { chapters } from '../chapters'
import type { Slide } from '../chapters'
import { chapterUrl } from '../hooks/useSlideshow'
import { Icon } from './Icon'

export function ChapterSidebar({
  activeChapterId,
  slide,
  slideNumber,
}: {
  activeChapterId: string
  slide: Slide
  slideNumber: number
}) {
  return (
    <aside className="sidebar">
      <section
        className="presenter-notes"
        aria-label="Presenter notes"
        key={`${activeChapterId}-${slide.id}`}
      >
        <div className="notes-label">
          Talking points <span>{String(slideNumber).padStart(2, '0')}</span>
        </div>
        <h2>{slide.title}</h2>
        <ul>
          {slide.talkingPoints?.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
        {slide.artwork?.map((brief) => (
          <details className="artwork-brief" key={brief.id}>
            <summary>Illustration brief</summary>
            <h3>{brief.title}</h3>
            <p>{brief.description}</p>
          </details>
        ))}
      </section>
      <nav className="chapter-nav" aria-label="Chapters">
        <div className="chapter-list">
          {chapters.map((chapter) => (
            <a
              className={`chapter-link${chapter.id === activeChapterId ? ' active' : ''}`}
              href={chapterUrl(chapter.id)}
              key={chapter.id}
              aria-current={chapter.id === activeChapterId ? 'page' : undefined}
            >
              <span className="chapter-number">
                {String(chapter.number).padStart(2, '0')}
              </span>
              <span className="chapter-link-title">{chapter.title}</span>
              <Icon name="chevron-right" size={15} />
            </a>
          ))}
        </div>
      </nav>
    </aside>
  )
}
