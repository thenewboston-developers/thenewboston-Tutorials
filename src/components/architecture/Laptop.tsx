import { useId, type ReactNode } from 'react'
import './laptop.css'

export function Laptop({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const id = useId()
  const bezel = `${id}-bezel`
  const deck = `${id}-deck`
  const edge = `${id}-edge`

  return (
    <div
      className={`architecture-laptop ${className}`}
      data-testid="program-laptop"
    >
      <div className="architecture-laptop-body">
        <svg
          className="architecture-laptop-hardware"
          viewBox="0 0 800 500"
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            <linearGradient id={bezel} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#36516f" />
              <stop offset="0.62" stopColor="#20354e" />
              <stop offset="1" stopColor="#14283f" />
            </linearGradient>
            <linearGradient id={deck} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#5e7b99" />
              <stop offset="1" stopColor="#3d5c7a" />
            </linearGradient>
            <linearGradient id={edge} x1="0" y1="0" x2="0" y2="1">
              <stop stopColor="#314d6b" />
              <stop offset="1" stopColor="#182c43" />
            </linearGradient>
          </defs>

          <rect x="47" y="7" width="714" height="389" rx="27" fill="#14263d" />
          <rect
            x="43"
            y="2"
            width="714"
            height="389"
            rx="26"
            fill={`url(#${bezel})`}
            stroke="#6683a0"
            strokeWidth="4"
          />
          <rect
            x="50"
            y="9"
            width="700"
            height="375"
            rx="20"
            fill="none"
            stroke="#7790a8"
            strokeWidth="1.5"
            strokeOpacity=".65"
          />
          <rect
            x="72"
            y="35"
            width="656"
            height="326"
            rx="10"
            fill="#f5f9fd"
            stroke="#a8bdd0"
            strokeWidth="2"
          />
          <circle cx="400" cy="19" r="5" fill="#112138" stroke="#8099b1" />
          <circle cx="400" cy="19" r="2" fill="#3a678b" />
          <circle cx="420" cy="19" r="2" fill="#7d9db8" />

          <path
            d="M77 376h141m364 0h141"
            stroke="#102237"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M79 373h137m369 0h136"
            stroke="#8fa6bb"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M53 389h694l50 67-21 29H24L3 456Z"
            fill={`url(#${edge})`}
            stroke="#233d58"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M53 384h694l50 72H3Z"
            fill={`url(#${deck})`}
            stroke="#6989a7"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path d="M66 389h668" stroke="#829cb4" strokeWidth="2" />

          <g transform="matrix(1 0 .16 .6 93 394)">
            <path
              d="M0-3h604l22 69H-22Z"
              fill="#2b435e"
              stroke="#7992aa"
              strokeWidth="1.5"
            />
            {Array.from({ length: 3 }, (_, row) => (
              <g key={row} transform={`translate(${-row * 5} ${row * 17})`}>
                {Array.from({ length: 13 }, (_, column) => (
                  <rect
                    key={column}
                    x={7 + column * 46}
                    width="38"
                    height="11"
                    rx="2"
                    fill="#152a42"
                    stroke="#607c96"
                    strokeWidth="1.3"
                  />
                ))}
              </g>
            ))}
            <g fill="#152a42" stroke="#607c96" strokeWidth="1.3">
              <rect x="-7" y="51" width="64" height="11" rx="2" />
              <rect x="65" y="51" width="64" height="11" rx="2" />
              <rect x="137" y="51" width="316" height="11" rx="2" />
              <rect x="461" y="51" width="64" height="11" rx="2" />
              <rect x="533" y="51" width="64" height="11" rx="2" />
            </g>
          </g>

          <path
            d="m326 437-7 15h162l-7-15Z"
            fill="#496887"
            stroke="#8ba6be"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M23 461h754" stroke="#7691aa" strokeWidth="2" />
          <path
            d="M335 457h130l-9 9H344Z"
            fill="#203a55"
            stroke="#496784"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M33 479h734"
            stroke="#10243a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <path
            d="M739 469h15"
            stroke="#74c9ba"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
        <div className="architecture-laptop-screen">{children}</div>
      </div>
      <strong className="architecture-laptop-name">Ping-pong app</strong>
    </div>
  )
}
