import { useEffect, useState, type CSSProperties } from 'react'
import { Coin } from '../graphics/Coin'
import { CoreServer, DataIcon, Phone } from './ArchitecturePrimitives'
import './messaging.css'
import './native-trade.css'

const phases = [
  'ready',
  'offer-to-core',
  'offer-to-carla',
  'awaiting-accept',
  'coffee-to-core',
  'coffee-to-bucky',
  'bonsai-to-core',
  'bonsai-to-carla',
  'complete',
] as const
type Phase = (typeof phases)[number]
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const wires = {
  bonsaiBucky: 'M450 650C450 480 725 650 825 510C890 420 985 416 1093 416',
  bonsaiCarla:
    'M1480 416C1600 416 1710 430 1760 510C1840 650 2170 480 2170 650',
  coffeeBucky: 'M699 1070C845 1070 900 1126 1093 1126',
  coffeeCarla: 'M1480 1126C1650 1126 1785 1070 1935 1070',
}
type Trip = {
  wire: keyof typeof wires
  reverse?: boolean
  kind: 'offer' | 'coffee' | 'bonsai'
}
const trips: Partial<Record<Phase, Trip>> = {
  'offer-to-core': { wire: 'bonsaiBucky', kind: 'offer' },
  'offer-to-carla': { wire: 'bonsaiCarla', kind: 'offer' },
  'coffee-to-core': { wire: 'coffeeCarla', reverse: true, kind: 'coffee' },
  'coffee-to-bucky': { wire: 'coffeeBucky', reverse: true, kind: 'coffee' },
  'bonsai-to-core': { wire: 'bonsaiBucky', kind: 'bonsai' },
  'bonsai-to-carla': { wire: 'bonsaiCarla', kind: 'bonsai' },
}

// Reduced motion resolves travel but must still stop for Carla's manual Accept.
function settleSegment(phase: Phase): Phase {
  if (phase === 'offer-to-core' || phase === 'offer-to-carla')
    return 'awaiting-accept'
  return trips[phase] ? 'complete' : phase
}

function TradeTerms({ receiving = false }: { receiving?: boolean }) {
  return (
    <dl className="architecture-native-terms">
      <div>
        <dt>{receiving ? 'You receive' : 'You give'}</dt>
        <dd>
          <Coin kind="bonsai" size={54} />
          <strong>1 Bonsai</strong>
        </dd>
      </div>
      <div>
        <dt>{receiving ? 'You give' : 'You receive'}</dt>
        <dd>
          <Coin kind="coffee" size={54} />
          <strong>20 Coffee</strong>
        </dd>
      </div>
    </dl>
  )
}

export function NativeTradeScene() {
  const [phase, setPhase] = useState<Phase>('ready')
  const index = phases.indexOf(phase)
  const offerReceived = index >= phases.indexOf('awaiting-accept')
  const accepted = index >= phases.indexOf('coffee-to-core')
  const coffeeReceived = index >= phases.indexOf('bonsai-to-core')
  const complete = phase === 'complete'
  const trip = trips[phase]

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    function preferenceChanged(event: MediaQueryListEvent) {
      if (event.matches) setPhase(settleSegment)
    }
    media.addEventListener('change', preferenceChanged)
    return () => media.removeEventListener('change', preferenceChanged)
  }, [])

  function sendOffer() {
    const reduced = window.matchMedia(reducedMotionQuery).matches
    setPhase((current) =>
      current === 'ready'
        ? reduced
          ? 'awaiting-accept'
          : 'offer-to-core'
        : current,
    )
  }

  function accept() {
    const reduced = window.matchMedia(reducedMotionQuery).matches
    setPhase((current) =>
      current === 'awaiting-accept'
        ? reduced
          ? 'complete'
          : 'coffee-to-core'
        : current,
    )
  }

  return (
    <div
      className="architecture-messaging-demo architecture-native-trade-demo"
      data-testid="native-trade-demo"
      data-phase={phase}
    >
      <svg
        className="architecture-connection-wires"
        viewBox="0 0 2560 1440"
        aria-hidden="true"
      >
        <path d={wires.bonsaiBucky} />
        <path d={wires.bonsaiCarla} />
        <path
          className="architecture-native-coffee-wire"
          d={wires.coffeeBucky}
        />
        <path
          className="architecture-native-coffee-wire"
          d={wires.coffeeCarla}
        />
      </svg>
      <div className="architecture-chat-core">
        <CoreServer />
      </div>
      <div className="architecture-native-coffee-core">
        <CoreServer currency="coffee" />
      </div>
      <Phone
        name="Bucky"
        className="architecture-chat-phone architecture-chat-bucky"
      >
        <div className="architecture-chat-screen architecture-native-screen">
          <label className="architecture-chat-compose">
            <span>To</span>
            <input value="Carla" readOnly tabIndex={-1} />
          </label>
          <TradeTerms />
          <div
            className="architecture-native-status"
            role="status"
            aria-live="polite"
          >
            {coffeeReceived ? (
              <div
                className="architecture-native-receipt"
                data-testid="native-trade-coffee-receipt"
              >
                <span>Accepted</span>
                <strong>
                  <Coin kind="coffee" size={48} />
                  +20 Coffee
                </strong>
              </div>
            ) : phase !== 'ready' ? (
              <span>Awaiting Carla</span>
            ) : null}
          </div>
          <button
            className="architecture-send-button architecture-chat-send"
            type="button"
            aria-disabled={phase !== 'ready'}
            onClick={sendOffer}
          >
            Send offer
          </button>
        </div>
      </Phone>
      <Phone
        name="Carla"
        className="architecture-chat-phone architecture-chat-ty"
      >
        {offerReceived && (
          <div className="architecture-chat-screen architecture-native-screen">
            <label className="architecture-chat-compose">
              <span>From</span>
              <input value="Bucky" readOnly tabIndex={-1} />
            </label>
            <TradeTerms receiving />
            <div
              className="architecture-native-status"
              role="status"
              aria-live="polite"
            >
              {complete ? (
                <div
                  className="architecture-native-receipt"
                  data-testid="native-trade-bonsai-receipt"
                >
                  <span>Trade complete</span>
                  <strong>
                    <Coin kind="bonsai" size={48} />
                    +1 Bonsai
                  </strong>
                </div>
              ) : (
                <span>{accepted ? 'Awaiting Bonsai' : 'Trade offer'}</span>
              )}
            </div>
            <div className="architecture-native-actions">
              <button
                className="architecture-send-button architecture-chat-send"
                type="button"
                aria-disabled={phase !== 'awaiting-accept'}
                onClick={accept}
              >
                Accept
              </button>
              <button
                className="architecture-native-decline"
                type="button"
                disabled
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </Phone>
      {trip && (
        <div
          key={phase}
          className={`architecture-chat-packet architecture-native-packet architecture-native-packet-${trip.kind}`}
          data-testid="native-trade-packet"
          data-leg={phase}
          style={
            {
              offsetPath: `path('${wires[trip.wire]}')`,
              '--chat-trip-start': trip.reverse ? '100%' : '0%',
              '--chat-trip-end': trip.reverse ? '0%' : '100%',
            } as CSSProperties
          }
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.animationName !== 'architecture-chat-travel'
            )
              return
            // Delivery of Coffee to Bucky begins the automatic Bonsai payment.
            setPhase((current) =>
              current === phase ? (phases[index + 1] ?? current) : current,
            )
          }}
        >
          {trip.kind === 'offer' ? (
            <DataIcon />
          ) : (
            <Coin kind={trip.kind} size={76} />
          )}
          <div>
            {trip.kind !== 'bonsai' && (
              <span>{trip.kind === 'offer' ? 'Offer' : 'Accepted'}</span>
            )}
            <p>
              {trip.kind === 'offer'
                ? '1 Bonsai for 20 Coffee'
                : trip.kind === 'coffee'
                  ? '20 Coffee'
                  : '1 Bonsai'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
