import { ServerIllustration } from './ServerIllustration'
import './bridge-server.css'

function BridgeEmblem() {
  return (
    <g>
      <rect
        x="29"
        y="41"
        width="88"
        height="88"
        rx="11"
        fill="#0f2b3b"
        stroke="#50858b"
        strokeWidth="2"
      />
      <rect
        x="34"
        y="46"
        width="78"
        height="78"
        rx="8"
        fill="#194553"
        stroke="#2a6370"
      />
      <path
        d="M41 101H105M53 67v41M93 67v41"
        stroke="#bee9dd"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M40 91Q48 85 53 67Q73 107 93 67Q98 85 106 91"
        fill="none"
        stroke="#6dd4c6"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M63 83v17M73 88v12M83 83v17" stroke="#8dc9c0" strokeWidth="2" />
      <g fill="#b5eee0" stroke="#226575" strokeWidth="1.5">
        <circle cx="53" cy="65" r="4.5" />
        <circle cx="93" cy="65" r="4.5" />
        <circle cx="40" cy="101" r="3.5" />
        <circle cx="106" cy="101" r="3.5" />
      </g>
      <path d="M54 115h38" stroke="#3e8c91" strokeWidth="2" />
    </g>
  )
}

export function BridgeServer({ className = '' }: { className?: string }) {
  return (
    <div
      className={`architecture-bridge-server ${className}`}
      data-testid="bridge-server"
    >
      <strong>Bridge</strong>
      <div className="architecture-bridge-server-picture">
        <ServerIllustration accent="teal" emblem={<BridgeEmblem />} />
      </div>
    </div>
  )
}
