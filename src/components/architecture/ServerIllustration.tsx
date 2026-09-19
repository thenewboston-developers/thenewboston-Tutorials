import { useId } from 'react'
import { Coin } from '../graphics/Coin'

export function ServerIllustration({
  connected = false,
  currency = 'bonsai',
}: {
  connected?: boolean
  currency?: 'bonsai' | 'bacoin' | 'bitcoin'
}) {
  const id = useId()
  const front = `${id}-front`
  const side = `${id}-side`
  const top = `${id}-top`
  const rack = `${id}-rack`

  return (
    <svg viewBox="0 0 600 420" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={front} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#334a64" />
          <stop offset="1" stopColor="#1b2c43" />
        </linearGradient>
        <linearGradient id={side} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#101d30" />
          <stop offset="1" stopColor="#1c2f48" />
        </linearGradient>
        <linearGradient id={top} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#4388c7" />
          <stop offset="1" stopColor="#2b5d93" />
        </linearGradient>
        <linearGradient id={rack} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#718ba5" />
          <stop offset="0.12" stopColor="#58728d" />
          <stop offset="1" stopColor="#3d536d" />
        </linearGradient>
      </defs>

      {connected && (
        <path d="M410 354v44" fill="none" stroke="#425c75" strokeWidth="4" />
      )}

      <path d="m353 152 147-67v245l-147 67Z" fill={`url(#${side})`} />
      <path d="m113 83 240 69v245l-240-69Z" fill={`url(#${front})`} />
      <path d="m113 83 147-67 240 69-147 67Z" fill={`url(#${top})`} />

      <g transform="matrix(1 .2875 1 -.45578 113 83)">
        <rect
          x="26"
          y="27"
          width="188"
          height="91"
          rx="5"
          fill="#255683"
          stroke="#6099c7"
          strokeWidth="1.4"
        />
        {Array.from({ length: 10 }, (_, index) => (
          <rect
            key={index}
            x={39 + index * 17}
            y="39"
            width="7"
            height="66"
            rx="2"
            fill="#142e4b"
          />
        ))}
      </g>

      <g transform="matrix(1 .2875 0 1 113 83)">
        <path d="M1 2h237" stroke="#74acd6" strokeWidth="2" />
        <path d="M8 12v220l221 0" fill="none" stroke="#4b637e" />
        <path d="M238 2v241" stroke="#122139" strokeWidth="4" />
        <rect x="15" y="28" width="211" height="196" rx="3" fill="#102035" />

        <g fill="#6ce0bd">
          <circle cx="26" cy="15" r="2.5" />
          <circle cx="37" cy="15" r="2.5" />
          <circle cx="48" cy="15" r="2.5" />
        </g>
        <path
          d="M176 14h29"
          stroke="#90aec5"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="216" cy="15" r="4.5" fill="#152940" stroke="#8faec6" />
        <path d="M216 11v4" stroke="#b0d4e8" strokeWidth="1.5" />

        {Array.from({ length: 5 }, (_, index) => (
          <g key={index} transform={`translate(0 ${33 + index * 38})`}>
            <path d="M19 3h202v31H19Z" fill="#0c192b" />
            <path d="m19 0 6-3h190l6 3Z" fill="#899db0" />
            <rect
              x="19"
              width="202"
              height="29"
              rx="2"
              fill={`url(#${rack})`}
            />
            <path d="M22 1h196" stroke="#8fa6ba" strokeWidth="1.2" />
            <path d="M22 28h196" stroke="#20364e" strokeWidth="2" />

            <g fill="#1c3047">
              {Array.from({ length: 7 }, (_, vent) => (
                <rect
                  key={vent}
                  x={52 + vent * 10}
                  y="7"
                  width="4"
                  height="14"
                  rx="1.5"
                />
              ))}
            </g>
            <rect x="142" y="5" width="46" height="18" rx="2" fill="#253e57" />
            <g fill="#70dab3">
              <circle cx="150" cy="11" r="2.4" />
              <circle cx="160" cy="11" r="2.4" />
            </g>
            <circle cx="170" cy="11" r="2.4" fill="#6daee8" />
            <circle
              cx="180"
              cy="11"
              r="2.4"
              fill={index === 3 ? '#e8b561' : '#5b788f'}
            />
            <path d="M148 18h10m5 0h6m5 0h8" stroke="#8faabd" strokeWidth="2" />

            <g fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path
                d="M31 8h-3v14h3m177-14h3v14h-3"
                stroke="#1d334b"
                strokeWidth="5"
              />
              <path
                d="M32 6h-3v14h3m175-14h3v14h-3"
                stroke="#bdd0de"
                strokeWidth="2.8"
              />
            </g>
            <g fill="#c0ced9">
              <circle cx="41" cy="7" r="1.25" />
              <circle cx="41" cy="22" r="1.25" />
              <circle cx="198" cy="7" r="1.25" />
              <circle cx="198" cy="22" r="1.25" />
            </g>
          </g>
        ))}
        <path d="M25 236h33m130 0h28" stroke="#7b8fa4" strokeWidth="3" />
      </g>

      <g transform="matrix(1 -.45578 0 1 353 152)">
        <path d="M3 3v237" stroke="#526b87" strokeWidth="2" />
        <path
          d="M19 22h108v203H19Z"
          fill="#162840"
          stroke="#2b425d"
          strokeWidth="1.5"
        />
        <path d="M25 29h96v158H25Z" fill="#1b2e47" />
        <foreignObject x="27" y="39" width="92" height="92">
          <Coin kind={currency} size={92} />
        </foreignObject>
        <g stroke="#0d1c30" strokeWidth="3.5" strokeLinecap="round">
          {Array.from({ length: 6 }, (_, index) => (
            <path key={index} d={`M38 ${154 + index * 8}h70`} />
          ))}
        </g>
        <path d="M29 33v146" stroke="#29415d" />
        <circle cx="118" cy="113" r="3" fill="#617a91" />
        <rect x="47" y="226" width="21" height="12" rx="2" fill="#091625" />
        <path
          d="M51 236v-6h13v6"
          fill="none"
          stroke="#7b91a6"
          strokeWidth="2"
        />
      </g>

      <path
        d="m113 83 147-67 240 69"
        fill="none"
        stroke="#578ab8"
        strokeWidth="1.5"
      />
      <path
        d="m113 328 240 69 147-67"
        fill="none"
        stroke="#101e31"
        strokeWidth="3"
      />
      <path d="m357 152 141-64" stroke="#3e5c7c" strokeWidth="2" />
    </svg>
  )
}
