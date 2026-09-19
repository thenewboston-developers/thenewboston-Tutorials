import { useEffect, useState, type CSSProperties } from 'react'
import { Coin } from '../graphics/Coin'
import { CoreServer, DataIcon, Phone } from './ArchitecturePrimitives'
import { BitcoinNode } from './BitcoinNode'
import { Laptop } from './Laptop'
import './messaging.css'
import './coins-data.css'
import './bitcoin-trading.css'

type Mode = 'buy' | 'sell'
const buyPhases = [
  'ready',
  'payment-to-core',
  'payment-to-app',
  'bitcoin-to-node',
  'confirming',
  'bitcoin-to-phone',
  'complete',
] as const
const sellPhases = [
  'ready',
  'address-request-to-core',
  'address-request-to-app',
  'address-to-core',
  'address-to-phone',
  'awaiting-bitcoin',
  'deposit-to-node',
  'confirming',
  'deposit-to-app',
  'payout-to-core',
  'payout-to-phone',
  'complete',
] as const
type Phase = (typeof buyPhases)[number] | (typeof sellPhases)[number]
const price = 100
const receivingAddress = 'bc1q…bucky'
const depositAddress = 'bc1q…trade'
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'
const wires = {
  corePhone: 'M450 650C450 480 725 650 825 510C890 420 985 416 1093 416',
  coreApp: 'M1390 604C1390 820 2020 605 2020 820',
  bitcoinPhone: 'M699 1070C845 1070 900 1090 1058 1090',
  bitcoinApp: 'M1393 1098C1480 1098 1510 1010 1663 1010',
}
type Trip = {
  wire: keyof typeof wires
  reverse?: boolean
  currency?: 'bacoin' | 'bitcoin'
  amount?: number
  title?: string
  payload: string
}
const trips: Partial<Record<Phase, Trip>> = {
  'payment-to-core': {
    wire: 'corePhone',
    currency: 'bacoin',
    amount: price,
    payload: receivingAddress,
  },
  'payment-to-app': {
    wire: 'coreApp',
    currency: 'bacoin',
    amount: price,
    payload: receivingAddress,
  },
  'bitcoin-to-node': {
    wire: 'bitcoinApp',
    reverse: true,
    currency: 'bitcoin',
    amount: 1,
    payload: receivingAddress,
  },
  'bitcoin-to-phone': {
    wire: 'bitcoinPhone',
    reverse: true,
    currency: 'bitcoin',
    amount: 1,
    payload: receivingAddress,
  },
  'address-request-to-core': {
    wire: 'corePhone',
    title: 'Sell 1 BTC',
    payload: 'Deposit address?',
  },
  'address-request-to-app': {
    wire: 'coreApp',
    title: 'Sell 1 BTC',
    payload: 'Deposit address?',
  },
  'address-to-core': {
    wire: 'coreApp',
    reverse: true,
    payload: depositAddress,
  },
  'address-to-phone': {
    wire: 'corePhone',
    reverse: true,
    payload: depositAddress,
  },
  'deposit-to-node': {
    wire: 'bitcoinPhone',
    currency: 'bitcoin',
    amount: 1,
    payload: depositAddress,
  },
  'deposit-to-app': {
    wire: 'bitcoinApp',
    currency: 'bitcoin',
    amount: 1,
    payload: depositAddress,
  },
  'payout-to-core': {
    wire: 'coreApp',
    reverse: true,
    currency: 'bacoin',
    amount: price,
    payload: 'Bitcoin received',
  },
  'payout-to-phone': {
    wire: 'corePhone',
    reverse: true,
    currency: 'bacoin',
    amount: price,
    payload: 'Bitcoin received',
  },
}

function settleSegment(mode: Mode, phase: Phase): Phase {
  if (phase === 'ready' || phase === 'awaiting-bitcoin' || phase === 'complete')
    return phase
  if (mode === 'sell' && phase.startsWith('address-')) return 'awaiting-bitcoin'
  return 'complete'
}

function TradeBalances({ mode, settled }: { mode: Mode; settled: boolean }) {
  const buying = mode === 'buy'
  const bucky = buying ? (settled ? 0 : price) : settled ? price : 0
  const delta = settled ? (buying ? -price : price) : 0
  return (
    <div className="architecture-coins-data-records" aria-live="polite">
      <table
        className="architecture-accounts"
        aria-label="Bacoin Core account balances"
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
            { id: 'bucky', label: 'Bucky 123', balance: bucky, change: delta },
            {
              id: 'app',
              label: 'App 789',
              balance: 2 * price - bucky,
              change: -delta,
            },
          ].map(({ id, label, balance, change }) => (
            <tr key={id}>
              <th scope="row">{label}</th>
              <td data-testid={`${id}-balance`}>{balance}</td>
              <td
                className={`architecture-change ${change > 0 ? 'architecture-credit' : 'architecture-debit'}`}
              >
                {change !== 0 && (
                  <span data-testid={`${id}-change`}>
                    {change > 0 ? '+' : '−'}
                    {Math.abs(change)}
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

function BitcoinBalance({
  owner,
  value,
}: {
  owner: 'bucky' | 'app'
  value: number
}) {
  return (
    <div
      className="architecture-trade-bitcoin-balance"
      aria-label={`${owner === 'bucky' ? 'Bucky' : 'App'} Bitcoin balance`}
    >
      <Coin kind="bitcoin" size={owner === 'app' ? 36 : 46} />
      <strong data-testid={`${owner}-bitcoin-balance`}>{value} BTC</strong>
    </div>
  )
}

export function BitcoinTradingScene({ mode }: { mode: Mode }) {
  const [phase, setPhase] = useState<Phase>('ready')
  const buying = mode === 'buy'
  const sequence: readonly Phase[] = buying ? buyPhases : sellPhases
  const index = sequence.indexOf(phase)
  const reached = (milestone: Phase) => index >= sequence.indexOf(milestone)
  const complete = phase === 'complete'
  const bacoinSettled = reached(buying ? 'payment-to-app' : 'payout-to-phone')
  const bitcoinSettled = reached(buying ? 'bitcoin-to-phone' : 'deposit-to-app')
  const addressReady = !buying && reached('awaiting-bitcoin')
  const monitoring = !buying && reached('address-to-core')
  const depositReceived = !buying && reached('payout-to-core')
  const appPaid = buying && reached('bitcoin-to-node')
  // A receiving wallet reflects the confirmation only after its update arrives.
  const buckyBitcoin = buying ? Number(complete) : Number(!bitcoinSettled)
  const appBitcoin = buying ? Number(!bitcoinSettled) : Number(depositReceived)
  const trip = trips[phase]
  const buttonEnabled = phase === 'ready' || phase === 'awaiting-bitcoin'

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    function preferenceChanged(event: MediaQueryListEvent) {
      if (event.matches) setPhase((current) => settleSegment(mode, current))
    }
    media.addEventListener('change', preferenceChanged)
    return () => media.removeEventListener('change', preferenceChanged)
  }, [mode])

  function advance() {
    setPhase((current) =>
      current === phase ? (sequence[index + 1] ?? current) : current,
    )
  }

  function send() {
    const reduced = window.matchMedia(reducedMotionQuery).matches
    const expected = addressReady ? 'awaiting-bitcoin' : 'ready'
    setPhase((current) => {
      if (current !== expected) return current
      let next: Phase
      if (current === 'ready')
        next = buying ? 'payment-to-core' : 'address-request-to-core'
      else if (!buying && current === 'awaiting-bitcoin')
        next = 'deposit-to-node'
      else return current
      return reduced ? settleSegment(mode, next) : next
    })
  }

  const appStatus = buying
    ? complete
      ? 'Bitcoin sent'
      : appPaid
        ? 'Sending 1 BTC'
        : 'Awaiting payment'
    : depositReceived
      ? 'Paying 100 Bacoin'
      : monitoring
        ? 'Awaiting 1 BTC'
        : 'Awaiting request'

  return (
    <div
      className="architecture-messaging-demo architecture-bitcoin-trade"
      data-testid="bitcoin-trade-demo"
      data-mode={mode}
      data-phase={phase}
    >
      <svg
        className="architecture-connection-wires"
        viewBox="0 0 2560 1440"
        aria-hidden="true"
      >
        <path d={wires.corePhone} />
        <path d={wires.coreApp} />
        <path className="architecture-bitcoin-wire" d={wires.bitcoinPhone} />
        <path className="architecture-bitcoin-wire" d={wires.bitcoinApp} />
      </svg>
      <div className="architecture-chat-core">
        <CoreServer currency="bacoin" connected />
      </div>
      <TradeBalances mode={mode} settled={bacoinSettled} />
      <div
        className={`architecture-trade-node${phase === 'confirming' ? ' architecture-trade-node-confirming' : ''}`}
      >
        <BitcoinNode />
        <div
          className="architecture-trade-confirmation-status"
          role="status"
          aria-live="polite"
        >
          {phase === 'confirming'
            ? 'Confirming…'
            : bitcoinSettled
              ? 'Confirmed'
              : ''}
        </div>
      </div>
      <Phone
        name="Bucky"
        className="architecture-chat-phone architecture-chat-bucky"
      >
        <div className="architecture-chat-screen architecture-trade-screen">
          <BitcoinBalance owner="bucky" value={buckyBitcoin} />
          <div className="architecture-trade-fields">
            <label className="architecture-chat-compose">
              <span>To</span>
              <input
                aria-label="Recipient on Bucky’s phone"
                value="Trading app"
                readOnly
                tabIndex={-1}
              />
            </label>
            <label className="architecture-chat-compose">
              <span>{buying ? 'Amount' : 'BTC amount'}</span>
              <input
                aria-label={
                  buying ? 'Amount to Trading app' : 'Bitcoin amount to sell'
                }
                value={buying ? '100' : '1'}
                readOnly
                tabIndex={-1}
              />
            </label>
          </div>
          <label className="architecture-chat-compose">
            <span>
              {buying ? 'Receiving BTC address' : 'Deposit BTC address'}
            </span>
            <input
              aria-label={
                buying ? 'Bitcoin receiving address' : 'Bitcoin deposit address'
              }
              value={
                buying ? receivingAddress : addressReady ? depositAddress : ''
              }
              placeholder={buying ? undefined : 'Request an address'}
              readOnly
              tabIndex={-1}
            />
          </label>
          <div
            className="architecture-chat-inbox"
            role="log"
            aria-label="Trade updates received by Bucky"
            aria-live="polite"
          >
            {complete ? (
              <div
                className="architecture-trade-receipt"
                data-testid="trade-phone-receipt"
              >
                <span>{buying ? 'Bitcoin received' : 'Payment received'}</span>
                <strong>
                  <Coin kind={buying ? 'bitcoin' : 'bacoin'} size={64} />
                  {buying ? '+1 BTC' : '+100 Bacoin'}
                </strong>
              </div>
            ) : !buying && phase === 'awaiting-bitcoin' ? (
              <p className="architecture-chat-bubble architecture-trade-address-ready">
                Address received
              </p>
            ) : null}
          </div>
          <button
            className="architecture-send-button architecture-chat-send"
            type="button"
            aria-disabled={!buttonEnabled}
            onClick={(event) => {
              // A double click must not also fund the newly revealed sell step.
              if (event.detail < 2) send()
            }}
            onKeyDown={(event) => {
              if (
                event.repeat &&
                (event.key === 'Enter' || event.key === ' ')
              ) {
                event.preventDefault()
              }
            }}
          >
            <span>
              {buying
                ? 'Buy 1 BTC'
                : addressReady
                  ? 'Send 1 BTC'
                  : 'Request address'}
            </span>
            {buying ? (
              <Coin kind="bacoin" size={50} />
            ) : addressReady ? (
              <Coin kind="bitcoin" size={50} />
            ) : (
              <DataIcon />
            )}
          </button>
        </div>
      </Phone>
      <Laptop name="Trading app" className="architecture-trade-laptop">
        <div
          className="architecture-trade-program"
          role="log"
          aria-label="Trading app activity"
          aria-live="polite"
        >
          <div
            className="architecture-trade-rate"
            aria-label="Example exchange rate: 100 Bacoin for 1 Bitcoin"
          >
            <span>
              <Coin kind="bitcoin" size={57} />
              <strong>1 BTC</strong>
            </span>
            <span className="architecture-trade-equals">=</span>
            <span>
              <Coin kind="bacoin" size={57} />
              <strong>100</strong>
            </span>
          </div>
          <strong
            className="architecture-trade-app-status"
            data-testid="trade-app-status"
          >
            {complete && !buying ? 'Payment sent' : appStatus}
          </strong>
          {monitoring && (
            <div
              className={`architecture-trade-monitor${depositReceived ? ' architecture-trade-monitor-confirmed' : ''}`}
              data-testid="deposit-monitor"
            >
              <span>
                {depositReceived ? 'Deposit confirmed' : 'Monitoring deposit'}
              </span>
              <code>{depositAddress}</code>
            </div>
          )}
          {buying && appPaid && (
            <code className="architecture-trade-app-address">
              {receivingAddress}
            </code>
          )}
          <BitcoinBalance owner="app" value={appBitcoin} />
        </div>
      </Laptop>
      {trip && (
        <div
          key={phase}
          className={`architecture-chat-packet architecture-trade-packet${trip.currency === 'bitcoin' ? ' architecture-trade-bitcoin-packet' : ''}`}
          data-testid="bitcoin-trade-packet"
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
              event.target === event.currentTarget &&
              event.animationName === 'architecture-chat-travel'
            )
              advance()
          }}
        >
          {trip.currency ? (
            <div
              className="architecture-trade-packet-amount"
              data-testid="trade-packet-amount"
            >
              <Coin kind={trip.currency} size={70} />
              <strong>{trip.amount}</strong>
            </div>
          ) : (
            <DataIcon />
          )}
          <div className="architecture-trade-packet-payload">
            {trip.title && <strong>{trip.title}</strong>}
            <p>{trip.payload}</p>
          </div>
        </div>
      )}
      {phase === 'confirming' && (
        <span
          className="architecture-trade-confirmation-clock"
          data-testid="bitcoin-confirmation"
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target === event.currentTarget &&
              event.animationName === 'architecture-bitcoin-confirmation'
            )
              advance()
          }}
        />
      )}
    </div>
  )
}
