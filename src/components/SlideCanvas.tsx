import { useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

const CANVAS_WIDTH = 2560
const CANVAS_HEIGHT = 1440

export function SlideCanvas({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const frame = frameRef.current
    if (!frame) return

    const updateScale = (width: number) => {
      frame.style.setProperty('--slide-scale', String(width / CANVAS_WIDTH))
    }

    updateScale(frame.getBoundingClientRect().width)
    const observer = new ResizeObserver(([entry]) => {
      updateScale(entry.contentRect.width)
    })
    observer.observe(frame)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      className="slide-frame"
      ref={frameRef}
      style={{ aspectRatio: `${CANVAS_WIDTH} / ${CANVAS_HEIGHT}` }}
    >
      <div
        className="slide-card"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      >
        {children}
      </div>
    </div>
  )
}
