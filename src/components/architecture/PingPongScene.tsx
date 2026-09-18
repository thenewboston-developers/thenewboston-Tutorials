import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react'
import { CoreServer, DataIcon, Phone } from './ArchitecturePrimitives'
import { Laptop } from './Laptop'
import './messaging.css'
import './ping-pong.css'

const legs = [
  'ping-to-core',
  'ping-to-program',
  'pong-to-core',
  'pong-to-phone',
] as const
type Leg = (typeof legs)[number]
type Phase = 'idle' | Leg | 'complete'
type Stopwatch = { elapsed: number; startedAt: number | null; running: boolean }

const wires = {
  phone: 'M450 650C450 480 725 650 825 510C890 420 985 416 1093 416',
  program: 'M1390 604C1390 820 2020 605 2020 820',
}
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function readStopwatch(clock: Stopwatch) {
  return (
    clock.elapsed +
    (clock.startedAt === null ? 0 : performance.now() - clock.startedAt)
  )
}

export function PingPongScene({ paused }: { paused: boolean }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [elapsed, setElapsed] = useState(0)
  const sent = useRef(false)
  const clock = useRef<Stopwatch>({
    elapsed: 0,
    startedAt: null,
    running: false,
  })
  const running = phase !== 'idle' && phase !== 'complete'
  const legIndex = legs.indexOf(phase as Leg)
  const reply = legIndex >= 2
  const programReceived = reply || phase === 'complete'

  const complete = useCallback(() => {
    if (!clock.current.running) return
    const finalElapsed = readStopwatch(clock.current)
    clock.current = { elapsed: finalElapsed, startedAt: null, running: false }
    setElapsed(finalElapsed)
    setPhase('complete')
  }, [])

  useEffect(() => {
    if (!running) return
    const stopwatch = clock.current
    if (!paused && stopwatch.startedAt === null) {
      stopwatch.startedAt = performance.now()
    }
    let frame = 0
    const tick = () => {
      setElapsed(readStopwatch(stopwatch))
      if (!paused) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
      // Stop accumulating when Pause or an unmount ends this active interval.
      stopwatch.elapsed = readStopwatch(stopwatch)
      stopwatch.startedAt = null
    }
  }, [running, paused])

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    const preferenceChanged = (event: MediaQueryListEvent) => {
      if (event.matches) complete()
    }
    media.addEventListener('change', preferenceChanged)
    return () => media.removeEventListener('change', preferenceChanged)
  }, [complete])

  function sendPing() {
    if (sent.current) return
    sent.current = true
    if (window.matchMedia(reducedMotionQuery).matches) {
      setPhase('complete')
      return
    }
    clock.current = {
      elapsed: 0,
      startedAt: paused ? null : performance.now(),
      running: true,
    }
    setPhase('ping-to-core')
  }

  const wire =
    phase === 'ping-to-core' || phase === 'pong-to-phone'
      ? wires.phone
      : wires.program

  return (
    <div className="architecture-messaging-demo" data-testid="ping-pong-demo">
      <svg
        className="architecture-connection-wires"
        viewBox="0 0 2560 1440"
        aria-hidden="true"
      >
        <path d={wires.phone} />
        <path d={wires.program} />
      </svg>
      <div className="architecture-chat-core">
        <CoreServer connected />
      </div>
      <Phone
        name="Bucky"
        className="architecture-chat-phone architecture-chat-bucky"
      >
        <div className="architecture-chat-screen architecture-ping-screen">
          <label className="architecture-chat-compose">
            <span>To</span>
            <input
              aria-label="Recipient on Bucky’s phone"
              value="Ping-pong app"
              readOnly
              tabIndex={-1}
            />
          </label>
          <div className="architecture-ping-stopwatch">
            <span>Round trip</span>
            <output
              role="timer"
              aria-label="Round-trip time"
              aria-live="off"
              data-testid="round-trip-timer"
              data-state={
                phase === 'idle' ? 'idle' : running ? 'running' : 'stopped'
              }
            >
              {(elapsed / 1000).toFixed(2)}
              <span>s</span>
            </output>
          </div>
          <div
            className="architecture-chat-inbox"
            role="log"
            aria-label="Reply received by Bucky"
            aria-live="polite"
          >
            {phase === 'complete' && (
              <p
                className="architecture-chat-bubble"
                data-testid="phone-pong-received"
              >
                Pong
              </p>
            )}
          </div>
          <button
            className="architecture-send-button architecture-chat-send"
            type="button"
            aria-disabled={phase !== 'idle'}
            onClick={sendPing}
          >
            <span>Send Ping</span>
            <DataIcon />
          </button>
        </div>
      </Phone>
      <Laptop className="architecture-ping-laptop">
        <div
          className="architecture-ping-program"
          role="log"
          aria-label="Ping-pong app activity"
          aria-live="polite"
        >
          {programReceived ? (
            <div className="architecture-ping-response">
              <div>
                <span>Received</span>
                <strong data-testid="program-ping-received">Ping</strong>
              </div>
              <svg viewBox="0 0 60 60" aria-hidden="true">
                <path d="M8 30h42M34 14l16 16-16 16" />
              </svg>
              <div>
                <span>Reply</span>
                <strong data-testid="program-pong-sent">Pong</strong>
              </div>
            </div>
          ) : (
            <div className="architecture-ping-listening">
              <DataIcon />
              <strong>Listening</strong>
            </div>
          )}
        </div>
      </Laptop>
      {running && (
        <div
          key={phase}
          className={`architecture-chat-packet architecture-ping-packet${reply ? ' architecture-ping-reply' : ''}`}
          data-testid="ping-pong-packet"
          data-leg={phase}
          style={
            {
              offsetPath: `path('${wire}')`,
              '--chat-trip-start': reply ? '100%' : '0%',
              '--chat-trip-end': reply ? '0%' : '100%',
            } as CSSProperties
          }
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.animationName !== 'architecture-chat-travel'
            )
              return
            if (phase === 'pong-to-phone') complete()
            else
              setPhase((current) =>
                current === phase ? legs[legIndex + 1] : current,
              )
          }}
        >
          <DataIcon />
          <p>{reply ? 'Pong' : 'Ping'}</p>
        </div>
      )}
    </div>
  )
}
