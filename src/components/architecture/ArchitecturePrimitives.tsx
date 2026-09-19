import type { ReactNode } from 'react'
import { ServerIllustration } from './ServerIllustration'

export function CoreServer({
  compact = false,
  connected = false,
  currency = 'bonsai',
}: {
  compact?: boolean
  connected?: boolean
  currency?: 'bonsai' | 'tuna'
}) {
  return (
    <div
      className={`architecture-server${compact ? ' architecture-server-small' : ''}`}
    >
      <strong>{currency === 'tuna' ? 'Tuna Core' : 'Bonsai Core'}</strong>
      <div className="architecture-server-picture">
        <ServerIllustration connected={connected} currency={currency} />
      </div>
    </div>
  )
}

export function Phone({
  name,
  children,
  className = '',
}: {
  name: string
  children?: ReactNode
  className?: string
}) {
  return (
    <div
      className={`architecture-phone ${className}`}
      data-testid={name.startsWith('Ty') ? 'ty-phone' : 'bucky-phone'}
    >
      <div className="architecture-phone-shell">
        <span className="architecture-phone-speaker" />
        <div className="architecture-phone-screen">{children}</div>
        <span className="architecture-phone-home" />
      </div>
      <strong className="architecture-phone-name">{name}</strong>
    </div>
  )
}

export function DataIcon() {
  return (
    <svg
      className="architecture-data-icon"
      viewBox="0 0 80 80"
      aria-hidden="true"
    >
      <rect
        x="8"
        y="12"
        width="64"
        height="52"
        rx="10"
        fill="#eef4fc"
        stroke="#5183b9"
        strokeWidth="4"
      />
      <path
        d="M21 29h38M21 41h31M21 53h20"
        stroke="#5183b9"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function ConnectionWires({
  recipient = false,
}: {
  recipient?: boolean
}) {
  return (
    <svg
      className="architecture-connection-wires"
      viewBox="0 0 2560 1440"
      aria-hidden="true"
    >
      <path d="M450 710C450 520 725 650 825 510C890 420 985 416 1093 416" />
      {recipient && <path d="M1390 604C1390 835 2170 610 2170 710" />}
    </svg>
  )
}
