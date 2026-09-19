import { useEffect, useState, type CSSProperties } from 'react'
import { Coin } from '../graphics/Coin'
import { CoreServer, DataIcon, Phone } from './ArchitecturePrimitives'
import { Laptop } from './Laptop'
import './messaging.css'
import './coins-data.css'
import './guessing-game.css'

const legs = [
  'guess-to-core',
  'guess-to-program',
  'result-to-core',
  'result-to-phone',
] as const
type Leg = (typeof legs)[number]
type GameState = {
  phase: 'ready' | Leg | 'complete'
  guess: string
  submittedGuess: number | null
}

const winningNumber = 5
const prize = 10
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const wires = {
  phone: 'M450 650C450 480 725 650 825 510C890 420 985 416 1093 416',
  program: 'M1390 604C1390 820 2020 605 2020 820',
}

function validGuess(value: string) {
  return /^(?:[1-9]|10)$/.test(value)
}

function GameBalances({ charged, paid }: { charged: boolean; paid: boolean }) {
  const bucky = 100 - (charged ? 1 : 0) + (paid ? prize : 0)
  const change = paid ? prize : charged ? -1 : 0
  return (
    <div className="architecture-coins-data-records" aria-live="polite">
      <table
        className="architecture-accounts"
        aria-label="Tuna Core account balances"
      >
        <thead>
          <tr>
            <th>Account</th>
            <th>Balance</th>
            <th className="architecture-change-heading" aria-label="Change" />
          </tr>
        </thead>
        <tbody>
          {[
            { id: 'bucky', label: 'Bucky 123', balance: bucky, delta: change },
            {
              id: 'app',
              label: 'App 789',
              balance: 200 - bucky,
              delta: -change,
            },
          ].map(({ id, label, balance, delta }) => (
            <tr key={id}>
              <th scope="row">{label}</th>
              <td data-testid={`${id}-balance`}>{balance}</td>
              <td
                className={`architecture-change ${delta > 0 ? 'architecture-credit' : 'architecture-debit'}`}
              >
                {delta !== 0 && (
                  <span data-testid={`${id}-change`}>
                    {delta > 0 ? '+' : '−'}
                    {Math.abs(delta)}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function GuessingGameScene() {
  const [state, setState] = useState<GameState>({
    phase: 'ready',
    guess: '1',
    submittedGuess: null,
  })
  const { phase, guess, submittedGuess } = state
  const ready = phase === 'ready'
  const complete = phase === 'complete'
  const legIndex = legs.indexOf(phase as Leg)
  const traveling = legIndex >= 0
  const reply = legIndex >= 2
  const programReceived = reply || complete
  const won = submittedGuess === winningNumber
  const result = won ? 'You win' : 'You lose'
  const charged = legIndex >= 1 || complete
  const paid = won && (legIndex >= 3 || complete)
  const sendable = ready && validGuess(guess)

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    function preferenceChanged(event: MediaQueryListEvent) {
      if (!event.matches) return
      setState((current) =>
        current.phase !== 'ready' && current.phase !== 'complete'
          ? { ...current, phase: 'complete' }
          : current,
      )
    }
    media.addEventListener('change', preferenceChanged)
    return () => media.removeEventListener('change', preferenceChanged)
  }, [])

  function send() {
    const reducedMotion = window.matchMedia(reducedMotionQuery).matches
    setState((current) => {
      if (current.phase !== 'ready' || !validGuess(current.guess))
        return current
      return {
        ...current,
        submittedGuess: Number(current.guess),
        phase: reducedMotion ? 'complete' : 'guess-to-core',
      }
    })
  }

  const wire =
    phase === 'guess-to-core' || phase === 'result-to-phone'
      ? wires.phone
      : wires.program

  return (
    <div
      className="architecture-messaging-demo"
      data-testid="guessing-game-demo"
    >
      <svg
        className="architecture-connection-wires"
        viewBox="0 0 2560 1440"
        aria-hidden="true"
      >
        <path d={wires.phone} />
        <path d={wires.program} />
      </svg>
      <div className="architecture-chat-core">
        <CoreServer connected currency="tuna" />
      </div>
      <GameBalances charged={charged} paid={paid} />
      <Phone
        name="Bucky"
        className="architecture-chat-phone architecture-chat-bucky"
      >
        <div className="architecture-chat-screen architecture-game-screen">
          <label className="architecture-chat-compose">
            <span>To</span>
            <input
              aria-label="Recipient on Bucky’s phone"
              value="Guessing game"
              readOnly
              tabIndex={-1}
            />
          </label>
          <div className="architecture-coins-data-fields">
            <label className="architecture-chat-compose">
              <span>Amount</span>
              <input
                aria-label="Amount to Guessing game"
                value="1"
                readOnly
                tabIndex={-1}
              />
            </label>
            <label className="architecture-chat-compose">
              <span>Guess 1–10</span>
              <input
                aria-label="Your guess"
                type="number"
                min="1"
                max="10"
                step="1"
                inputMode="numeric"
                value={guess}
                readOnly={!ready}
                tabIndex={ready ? undefined : -1}
                aria-invalid={ready && !validGuess(guess)}
                onChange={(event) => {
                  const value = event.target.value
                  setState((current) =>
                    current.phase === 'ready'
                      ? { ...current, guess: value }
                      : current,
                  )
                }}
              />
            </label>
          </div>
          <div
            className="architecture-chat-inbox"
            role="log"
            aria-label="Game result received by Bucky"
            aria-live="polite"
          >
            {complete && (
              <div className="architecture-game-receipt">
                <p
                  className={`architecture-chat-bubble${won ? '' : ' architecture-game-loss'}`}
                  data-testid="game-phone-result"
                >
                  {result}
                </p>
                {won && (
                  <strong
                    className="architecture-game-credit"
                    data-testid="game-coin-received"
                  >
                    <Coin kind="tuna" size={58} />
                    <span>+10 Tuna</span>
                  </strong>
                )}
              </div>
            )}
          </div>
          <button
            className="architecture-send-button architecture-chat-send"
            type="button"
            aria-disabled={!sendable}
            onClick={send}
          >
            <span>Send</span>
            <Coin kind="tuna" size={54} />
          </button>
        </div>
      </Phone>
      <Laptop name="Guessing game" className="architecture-game-laptop">
        <div
          className="architecture-game-program"
          role="log"
          aria-label="Guessing game activity"
          aria-live="polite"
        >
          {programReceived ? (
            <>
              <span className="architecture-game-program-caption">
                Your guess: {submittedGuess}
              </span>
              <strong
                className={
                  won
                    ? 'architecture-game-win-title'
                    : 'architecture-game-loss-title'
                }
                data-testid="game-program-result"
              >
                {result}
              </strong>
              {won && (
                <div className="architecture-game-prize">
                  <Coin kind="tuna" size={66} />
                  <span>10 Tuna</span>
                </div>
              )}
            </>
          ) : (
            <>
              <span className="architecture-game-program-caption">
                Pick a number
              </span>
              <strong>1–10</strong>
              <div className="architecture-game-prize">
                <Coin kind="tuna" size={66} />
                <span>10 Tuna prize</span>
              </div>
            </>
          )}
        </div>
      </Laptop>
      {traveling && submittedGuess !== null && (
        <div
          key={phase}
          className="architecture-chat-packet architecture-game-packet"
          data-testid="guessing-game-packet"
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
            setState((current) =>
              current.phase === phase
                ? { ...current, phase: legs[legIndex + 1] ?? 'complete' }
                : current,
            )
          }}
        >
          {!reply || won ? (
            <div
              className="architecture-game-packet-amount"
              data-testid="game-packet-amount"
            >
              <Coin kind="tuna" size={76} />
              <strong>{reply ? prize : 1}</strong>
            </div>
          ) : (
            <DataIcon />
          )}
          <p>{reply ? result : `Guess ${submittedGuess}`}</p>
        </div>
      )}
    </div>
  )
}
