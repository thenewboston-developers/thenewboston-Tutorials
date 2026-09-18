import { useEffect, useState, type CSSProperties } from 'react'
import { CoreServer, DataIcon, Phone } from './ArchitecturePrimitives'
import './messaging.css'

type Sender = 'bucky' | 'ty'
type Leg = 'to-core' | 'to-phone'
type ReceivedMessage = { text: string; id: number }
type ChatState = {
  sequence: number
  transit: { sender: Sender; leg: Leg; id: number; text: string } | null
  received: Record<Sender, ReceivedMessage | null>
  drafts: Record<Sender, string>
  replyPending: number | null
  replyTyping: { id: number; length: number } | null
}

const messages = { bucky: 'Hello, Ty', ty: 'Hey Dad' }
const names = { bucky: 'Bucky', ty: 'Ty' }
const wires = {
  bucky: 'M450 650C450 480 725 650 825 510C890 420 985 416 1093 416',
  ty: 'M1390 604C1390 835 2170 570 2170 650',
}
const reducedMotionQuery = '(prefers-reduced-motion: reduce)'

function otherPhone(sender: Sender): Sender {
  return sender === 'bucky' ? 'ty' : 'bucky'
}

function deliver(state: ChatState): ChatState {
  if (!state.transit) return state
  const { sender, id, text } = state.transit
  return {
    ...state,
    transit: null,
    replyPending: sender === 'bucky' ? id : null,
    received: {
      ...state.received,
      [otherPhone(sender)]: { text, id },
    },
  }
}

export function MessagingScene() {
  const [chat, setChat] = useState<ChatState>({
    sequence: 0,
    transit: null,
    received: { bucky: null, ty: null },
    drafts: { bucky: messages.bucky, ty: '' },
    replyPending: null,
    replyTyping: null,
  })
  const { transit, received, drafts, replyPending, replyTyping } = chat

  useEffect(() => {
    const media = window.matchMedia(reducedMotionQuery)
    function preferenceChanged(event: MediaQueryListEvent) {
      if (event.matches) setChat(deliver)
    }
    media.addEventListener('change', preferenceChanged)
    return () => media.removeEventListener('change', preferenceChanged)
  }, [])

  function send(sender: Sender) {
    const reducedMotion = window.matchMedia(reducedMotionQuery).matches
    setChat((current) => {
      if (current.transit || current.replyTyping || !current.drafts[sender])
        return current
      const next: ChatState = {
        ...current,
        sequence: current.sequence + 1,
        drafts: { ...current.drafts, [sender]: '' },
        transit: {
          sender,
          leg: 'to-core',
          id: current.sequence + 1,
          text: current.drafts[sender],
        },
      }
      return reducedMotion ? deliver(next) : next
    })
  }

  const wire = transit
    ? transit.leg === 'to-core'
      ? transit.sender
      : otherPhone(transit.sender)
    : null
  const reverse = transit?.sender === 'ty'
  const tripStyle = wire
    ? ({
        offsetPath: `path('${wires[wire]}')`,
        '--chat-trip-start': reverse ? '100%' : '0%',
        '--chat-trip-end': reverse ? '0%' : '100%',
      } as CSSProperties)
    : undefined

  return (
    <div className="architecture-messaging-demo" data-testid="messaging-demo">
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
      {(['bucky', 'ty'] as const).map((sender) => (
        <Phone
          key={sender}
          name={names[sender]}
          className={`architecture-chat-phone architecture-chat-${sender}`}
        >
          <div className="architecture-chat-screen">
            <div
              className="architecture-chat-inbox"
              role="log"
              aria-label={`Messages received by ${names[sender]}`}
              aria-live="polite"
              aria-relevant="additions text"
            >
              {received[sender] && (
                <p
                  key={received[sender].id}
                  className="architecture-chat-bubble"
                  data-testid={`chat-${sender}-received`}
                  data-message-id={received[sender].id}
                >
                  {received[sender].text}
                </p>
              )}
            </div>
            <label className="architecture-chat-compose">
              <span>To</span>
              <input
                aria-label={`Recipient on ${names[sender]}’s phone`}
                value={names[otherPhone(sender)]}
                readOnly
                tabIndex={-1}
              />
            </label>
            <label className="architecture-chat-compose">
              <span>Message</span>
              <textarea
                aria-label={`Message to ${names[otherPhone(sender)]}`}
                value={drafts[sender]}
                readOnly
                rows={2}
                tabIndex={-1}
              />
            </label>
            <button
              className="architecture-send-button architecture-chat-send"
              type="button"
              aria-disabled={
                Boolean(transit) || Boolean(replyTyping) || !drafts[sender]
              }
              onClick={() => send(sender)}
            >
              <span>Send</span>
              <DataIcon />
            </button>
          </div>
        </Phone>
      ))}
      {replyPending !== null && (
        <span
          key={replyPending}
          className="architecture-chat-reply-delay"
          data-testid="reply-delay"
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.animationName !== 'architecture-chat-reply-ready'
            )
              return
            setChat((current) =>
              current.replyPending === replyPending
                ? {
                    ...current,
                    replyPending: null,
                    replyTyping: { id: replyPending, length: 1 },
                    drafts: { ...current.drafts, ty: messages.ty.slice(0, 1) },
                  }
                : current,
            )
          }}
        />
      )}
      {replyTyping && (
        <span
          key={`${replyTyping.id}-${replyTyping.length}`}
          className="architecture-chat-reply-typing"
          data-testid="reply-typing"
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.animationName !== 'architecture-chat-type-character'
            )
              return
            setChat((current) => {
              if (
                current.replyTyping?.id !== replyTyping.id ||
                current.replyTyping.length !== replyTyping.length
              )
                return current
              const length = replyTyping.length + 1
              return {
                ...current,
                replyTyping:
                  length < messages.ty.length
                    ? { id: replyTyping.id, length }
                    : null,
                drafts: { ...current.drafts, ty: messages.ty.slice(0, length) },
              }
            })
          }}
        />
      )}
      {transit && (
        <div
          key={`${transit.id}-${transit.leg}`}
          className="architecture-chat-packet"
          data-testid="message-packet"
          data-sender={transit.sender}
          data-leg={transit.leg}
          style={tripStyle}
          aria-hidden="true"
          onAnimationEnd={(event) => {
            if (
              event.target !== event.currentTarget ||
              event.animationName !== 'architecture-chat-travel'
            )
              return
            setChat((current) => {
              if (
                current.transit?.id !== transit.id ||
                current.transit.leg !== transit.leg
              )
                return current
              return transit.leg === 'to-core'
                ? {
                    ...current,
                    transit: { ...current.transit, leg: 'to-phone' },
                  }
                : deliver(current)
            })
          }}
        >
          <DataIcon />
          <p>{transit.text}</p>
        </div>
      )}
    </div>
  )
}
