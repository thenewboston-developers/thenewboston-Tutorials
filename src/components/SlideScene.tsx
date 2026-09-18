import type { Slide } from '../chapters'
import { ArchitectureScenes } from './architecture/ArchitectureScenes'
import './scene.css'

export function SlideScene({
  slide,
  paused = false,
}: {
  slide: Slide
  phase?: number
  paused?: boolean
}) {
  return <ArchitectureScenes slide={slide} paused={paused} />
}
