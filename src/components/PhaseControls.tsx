import type { KeyboardEvent } from 'react'
import { Icon } from './Icon'
import './phase-controls.css'

type PhaseControlsProps = {
  phases: readonly [string, ...string[]]
  phase: number
  onChange: (phase: number) => void
}

export function PhaseControls({ phases, phase, onChange }: PhaseControlsProps) {
  function moveWithKeyboard(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    let next: number
    switch (event.key) {
      case 'ArrowLeft':
        next = Math.max(0, phase - 1)
        break
      case 'ArrowRight':
        next = Math.min(phases.length - 1, phase + 1)
        break
      case 'Home':
        next = 0
        break
      case 'End':
        next = phases.length - 1
        break
      default:
        return
    }
    // Arrow keys within this control navigate phases, not the slide route.
    event.preventDefault()
    event.stopPropagation()
    if (next !== phase) onChange(next)
  }

  return (
    <section
      className="phase-controls"
      aria-label="Animation phase controls"
      onKeyDown={moveWithKeyboard}
    >
      <div className="phase-toolbar">
        <p className="phase-status" role="status" aria-atomic="true">
          Phase <strong>{phase + 1}</strong> of {phases.length}
          <span>{phases[phase]}</span>
        </p>
        <div className="phase-arrows">
          <button
            type="button"
            className="phase-arrow"
            aria-label="Previous phase"
            aria-disabled={phase === 0}
            onClick={() => {
              if (phase > 0) onChange(phase - 1)
            }}
          >
            <Icon name="arrow-left" size={16} />
            Back
          </button>
          <button
            type="button"
            className="phase-arrow phase-next"
            aria-label="Next phase"
            aria-disabled={phase === phases.length - 1}
            onClick={() => {
              if (phase < phases.length - 1) onChange(phase + 1)
            }}
          >
            Next phase
            <Icon name="arrow-right" size={16} />
          </button>
        </div>
      </div>
      <nav className="phase-steps" aria-label="Animation phases">
        {phases.map((label, index) => (
          <button
            key={label}
            type="button"
            className="phase-step"
            aria-label={`Go to phase ${index + 1}: ${label}`}
            aria-current={phase === index ? 'step' : undefined}
            onClick={() => onChange(index)}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            {label}
          </button>
        ))}
      </nav>
    </section>
  )
}
