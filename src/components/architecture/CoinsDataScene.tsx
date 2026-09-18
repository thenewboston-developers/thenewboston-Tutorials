import { useEffect, useState, type CSSProperties } from 'react'
import { Coin } from '../graphics/Coin'
import { AccountTable } from './AccountTable'
import { CoreServer, Phone } from './ArchitecturePrimitives'
import './messaging.css'
import './coins-data.css'

type Transfer = { amount: number; message: string }
type TransferState = {
  phase: 'ready' | 'to-core' | 'to-phone' | 'received'
  amount: string
  message: string
  transfer: Transfer | null
}

const wires = {
  bucky: 'M450 650C450 480 725 650 825 510C890 420 985 416 1093 416',
  ty: 'M1390 604C1390 835 2170 570 2170 650',
}
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const startingBalances = { bucky: 99, ty: 1 }

function validAmount(value: string) {
  const amount = Number(value)
  return (
    Number.isInteger(amount) && amount > 0 && amount <= startingBalances.bucky
  )
}

export function CoinsDataScene() {
  const [state, setState] = useState<TransferState>({
    phase: 'ready',
    amount: '1',
    message: 'Here you go',
    transfer: null,
  })
  const { phase, amount, message, transfer } = state
  const ready = phase === 'ready'
  const settled = phase === 'to-phone' || phase === 'received'
  const traveling = phase === 'to-core' || phase === 'to-phone'
  const sendable = ready && validAmount(amount) && Boolean(message.trim())

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    function preferenceChanged(event: MediaQueryListEvent) {
      if (event.matches) {
        setState((current) =>
          current.phase === 'to-core' || current.phase === 'to-phone'
            ? { ...current, phase: 'received' }
            : current,
        )
      }
    }
    media.addEventListener('change', preferenceChanged)
    return () => media.removeEventListener('change', preferenceChanged)
  }, [])

  function send() {
    const reducedMotion = window.matchMedia(reducedMotionQuery).matches
    setState((current) => {
      if (
        current.phase !== 'ready' ||
        !validAmount(current.amount) ||
        !current.message.trim()
      )
        return current
      return {
        ...current,
        phase: reducedMotion ? 'received' : 'to-core',
        message: '',
        transfer: {
          amount: Number(current.amount),
          message: current.message.trim(),
        },
      }
    })
  }

  return (
    <div className="architecture-messaging-demo" data-testid="coins-data-demo">
      <svg
        className="architecture-connection-wires"
        viewBox="0 0 2560 1440"
        aria-hidden="true"
      >
        <path d={wires.bucky} />
        <path d={wires.ty} />
      </svg>
      <div className="architecture-chat-core">
        <CoreServer connected />
      </div>
      <div className="architecture-coins-data-records" aria-live="polite">
        <AccountTable
          bucky={
            startingBalances.bucky - (settled && transfer ? transfer.amount : 0)
          }
          ty={startingBalances.ty + (settled && transfer ? transfer.amount : 0)}
          showChanges={settled}
          changeAmount={transfer?.amount}
        />
      </div>
      {(['bucky', 'ty'] as const).map((person) => {
        const sender = person === 'bucky'
        const recipient = sender ? 'Ty' : 'Bucky'
        return (
          <Phone
            key={person}
            name={sender ? 'Bucky' : 'Ty'}
            className={`architecture-chat-phone architecture-chat-${person}`}
          >
            <div className="architecture-chat-screen">
              <div
                className="architecture-chat-inbox"
                role="log"
                aria-label={`Messages received by ${sender ? 'Bucky' : 'Ty'}`}
                aria-live="polite"
                aria-relevant="additions text"
              >
                {!sender && phase === 'received' && transfer && (
                  <div className="architecture-coins-data-receipt">
                    <p
                      className="architecture-chat-bubble"
                      data-testid="chat-ty-received"
                    >
                      {transfer.message}
                    </p>
                    <strong
                      className="architecture-coins-data-credit"
                      data-testid="ty-coin-received"
                    >
                      <Coin kind="bonsai" size={58} />
                      <span>
                        +{transfer.amount}{' '}
                        {transfer.amount === 1 ? 'coin' : 'coins'}
                      </span>
                    </strong>
                  </div>
                )}
              </div>
              <div className="architecture-coins-data-fields">
                <label className="architecture-chat-compose">
                  <span>To</span>
                  <input
                    aria-label={`Recipient on ${sender ? 'Bucky' : 'Ty'}’s phone`}
                    value={recipient}
                    readOnly
                    tabIndex={-1}
                  />
                </label>
                <label className="architecture-chat-compose">
                  <span>Amount</span>
                  <input
                    type="number"
                    min="1"
                    max={startingBalances.bucky}
                    step="1"
                    inputMode="numeric"
                    aria-label={`Amount to ${recipient}`}
                    value={sender ? amount : ''}
                    readOnly={!sender || !ready}
                    tabIndex={sender && ready ? undefined : -1}
                    aria-invalid={sender && ready && !validAmount(amount)}
                    onChange={(event) => {
                      const value = event.target.value
                      setState((current) =>
                        sender && current.phase === 'ready'
                          ? { ...current, amount: value }
                          : current,
                      )
                    }}
                  />
                </label>
              </div>
              <label className="architecture-chat-compose">
                <span>Message</span>
                <textarea
                  aria-label={`Message to ${recipient}`}
                  value={sender ? message : ''}
                  readOnly={!sender || !ready}
                  rows={2}
                  tabIndex={sender && ready ? undefined : -1}
                  onChange={(event) => {
                    const value = event.target.value
                    setState((current) =>
                      sender && current.phase === 'ready'
                        ? { ...current, message: value }
                        : current,
                    )
                  }}
                />
              </label>
              <button
                className="architecture-send-button architecture-chat-send"
                type="button"
                aria-disabled={!sender || !sendable}
                onClick={() => {
                  if (sender) send()
                }}
              >
                <span>Send</span>
                <Coin kind="bonsai" size={54} />
              </button>
            </div>
          </Phone>
        )
      })}
      {traveling && transfer && (
        <div
          key={phase}
          className="architecture-chat-packet architecture-coins-data-packet"
          data-testid="coin-message-packet"
          data-leg={phase}
          style={
            {
              offsetPath: `path('${phase === 'to-core' ? wires.bucky : wires.ty}')`,
              '--chat-trip-start': '0%',
              '--chat-trip-end': '100%',
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
                ? {
                    ...current,
                    phase: phase === 'to-core' ? 'to-phone' : 'received',
                  }
                : current,
            )
          }}
        >
          <div className="architecture-coins-data-packet-amount">
            <Coin kind="bonsai" size={76} />
            <strong>{transfer.amount}</strong>
          </div>
          <p>{transfer.message}</p>
        </div>
      )}
    </div>
  )
}
