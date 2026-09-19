import { useState } from 'react'
import type { Slide } from '../../chapters/types'
import { Coin } from '../graphics/Coin'
import { CoreServer, Phone, ConnectionWires } from './ArchitecturePrimitives'
import { RequestTypesScene } from './RequestTypesScene'
import { MessagingScene } from './MessagingScene'
import { CoinsDataScene } from './CoinsDataScene'
import { PingPongScene } from './PingPongScene'
import { GuessingGameScene } from './GuessingGameScene'
import { BitcoinTradingScene } from './BitcoinTradingScene'
import { AccountTable } from './AccountTable'
import './architecture.css'

function SendForm({
  onSend,
  sent = false,
}: {
  onSend?: () => void
  sent?: boolean
}) {
  return (
    <div
      className={`architecture-send-form${onSend ? ' architecture-send-form-interactive' : ''}`}
      aria-hidden={onSend ? undefined : true}
    >
      <label className="architecture-send-field">
        <span>To</span>
        <input value="Ty" readOnly tabIndex={-1} />
      </label>
      <label className="architecture-send-field">
        <span>Amount</span>
        <input value="1" readOnly tabIndex={-1} />
      </label>
      <button
        className="architecture-send-button"
        type="button"
        disabled={!onSend}
        aria-disabled={onSend ? sent : undefined}
        onClick={() => {
          if (!sent) onSend?.()
        }}
      >
        <span>Send</span>
        <Coin kind="bonsai" size={62} />
      </button>
    </div>
  )
}

function ConnectedPhone() {
  return (
    <div className="architecture-connected-state">
      <svg viewBox="0 0 160 160" aria-hidden="true" focusable="false">
        <circle cx="80" cy="80" r="72" fill="#e2f3ea" />
        <path
          d="m43 81 25 25 51-53"
          fill="none"
          stroke="currentColor"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <strong>Connected</strong>
    </div>
  )
}

function Packet() {
  return (
    <div
      className="architecture-packet architecture-first-request"
      data-testid="request-packet"
    >
      <div className="architecture-packet-amount">
        <Coin kind="bonsai" size={112} />
        <strong>1</strong>
      </div>
    </div>
  )
}

const firstDescriptions = [
  'Bonsai Core is the server for Bonsai Coins.',
  'One hundred Bonsai Coins have been minted. The Core account table records Bucky 123 with a balance of 100.',
  'Bucky’s phone shows a green check mark and Connected. Core still records Bucky 123 with 100 Bonsai Coins.',
  'Bucky’s phone shows To: Ty, Amount: 1, and a Send button with the Bonsai Coin logo. Core records only Bucky 123 with 100 coins. Press Send to start the one-coin transfer to Ty.',
]

function CoreTransfer({
  phase,
  sent,
  onSend,
}: {
  phase: number
  sent: boolean
  onSend: () => void
}) {
  return (
    <>
      {phase >= 2 && <ConnectionWires />}
      <div className="architecture-first-core">
        <CoreServer />
        {phase >= 1 && (
          <div className="architecture-first-records">
            <AccountTable
              bucky={sent ? 99 : 100}
              ty={sent ? 1 : undefined}
              changing={sent}
            />
          </div>
        )}
      </div>
      {phase >= 2 && (
        <Phone name="Bucky 123" className="architecture-first-phone">
          {phase >= 3 ? (
            <SendForm onSend={onSend} sent={sent} />
          ) : (
            <ConnectedPhone />
          )}
        </Phone>
      )}
      {sent && <Packet />}
    </>
  )
}

const coreSteps = {
  'architecture-core-server': 0,
  'architecture-core-mint': 1,
  'architecture-core-connect': 2,
  'architecture-core-transfer': 3,
} as const

export function ArchitectureScenes({
  slide,
  paused = false,
}: {
  slide: Slide
  paused?: boolean
}) {
  const [sent, setSent] = useState(false)
  const visual = slide.visual as string
  const step = coreSteps[visual as keyof typeof coreSteps]
  const description =
    step !== undefined
      ? sent
        ? 'Bucky sends one Bonsai Coin to Ty. The request travels from his phone to Core, then Core updates Bucky 123 from 100 to 99 and credits Ty 456 with 1. Replay resets this example for another demonstration.'
        : firstDescriptions[step]
      : visual === 'architecture-messaging'
        ? 'A messaging app connects Bucky and Ty through Bonsai Core. Bucky starts with Hello, Ty ready to send. Each Send clears its message field, and the message travels through Core before appearing on the other phone. Two seconds after Ty receives the message, Hey Dad types into his field one character at a time. Once complete, it waits for his Send button. Replay resets the conversation.'
        : visual === 'architecture-coins-data'
          ? 'Send coins and a message together from Bucky to Ty through Bonsai Core. Continue from the earlier transfer with Bucky at 99 and Ty at 1. Start with Amount 1 and Here you go. The amount and message are editable. Core updates the balances when the request arrives, producing 98 and 2 for a one-coin transfer, then Ty receives the message and a coin receipt. Replay restores the starting balances of 99 and 1.'
          : visual === 'architecture-ping-pong'
            ? 'Bucky’s phone connects through Bonsai Core to a Ping-pong app on a laptop. Press Send Ping to start the round-trip timer. The laptop automatically replies with Pong when Ping arrives. Pong returns through Core, and the timer stops only when Bucky’s phone receives it. Pause holds both travel and timing; Replay resets the demonstration.'
            : visual === 'architecture-bacoin-core'
              ? 'Tuna Core is a new server for Tuna, illustrated with a silver coin with a colored tuna emblem.'
              : visual === 'architecture-guessing-game'
                ? 'Bucky’s phone and a guessing game on a laptop connect through Tuna Core. Both accounts start with 100 Tuna. Send one coin with a whole-number guess from 1 to 10. Core records the entry payment before the app receives the guess. A correct guess returns You win and ten Tuna through Core; an incorrect guess returns only You lose. The phone shows the result only on arrival. Replay resets the game.'
                : visual === 'architecture-bitcoin-buy'
                  ? 'Bucky’s phone and a trading app connect to both Tuna Core and a Bitcoin node. Buy one Bitcoin by sending 100 Tuna and a receiving Bitcoin address through Core. After receiving payment, the app sends one Bitcoin through the Bitcoin network. The diagram confirms the Bitcoin transaction before showing the receipt on Bucky’s phone.'
                  : visual === 'architecture-bitcoin-sell'
                    ? 'Bucky asks the trading app for a deposit address for one Bitcoin through Tuna Core. After the address arrives, click Send one Bitcoin. The app monitors its deposit address, waits for the Bitcoin confirmation, then sends 100 Tuna through Core. The payment appears on Bucky’s phone only after delivery.'
                    : 'Three kinds of requests, all addressed to Ty: one coin only; the payload Hello, Ty alone with no amount shown; or one coin with that payload.'

  return (
    <div
      className={`vision-slide architecture-scene ${visual}`}
      role={
        step === 3 ||
        visual === 'architecture-messaging' ||
        visual === 'architecture-coins-data' ||
        visual === 'architecture-ping-pong' ||
        visual === 'architecture-guessing-game' ||
        visual === 'architecture-bitcoin-buy' ||
        visual === 'architecture-bitcoin-sell'
          ? 'group'
          : 'img'
      }
      aria-label={description}
    >
      {step !== undefined && (
        <CoreTransfer phase={step} sent={sent} onSend={() => setSent(true)} />
      )}
      {visual === 'architecture-request-types' && <RequestTypesScene />}
      {visual === 'architecture-messaging' && <MessagingScene />}
      {visual === 'architecture-coins-data' && <CoinsDataScene />}
      {visual === 'architecture-ping-pong' && <PingPongScene paused={paused} />}
      {visual === 'architecture-bacoin-core' && (
        <div className="architecture-first-core">
          <CoreServer currency="tuna" />
        </div>
      )}
      {visual === 'architecture-guessing-game' && <GuessingGameScene />}
      {visual === 'architecture-bitcoin-buy' && (
        <BitcoinTradingScene mode="buy" />
      )}
      {visual === 'architecture-bitcoin-sell' && (
        <BitcoinTradingScene mode="sell" />
      )}
    </div>
  )
}
