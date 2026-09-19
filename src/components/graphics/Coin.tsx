import { useId } from 'react'
import { BonsaiArtwork } from './BonsaiArtwork'
import { TunaArtwork } from './TunaArtwork'
import { BitcoinArtwork } from './BitcoinArtwork'
import './coin-artwork.css'

function CoinSprig({ flip = false }: { flip?: boolean }) {
  return (
    <g transform={flip ? 'translate(256 0) scale(-1 1)' : undefined}>
      <path
        d="M60 192q-26-25-24-55"
        fill="none"
        stroke="#5f6433"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M52 182c-18 0-22-10-21-17 10 1 18 6 21 17Zm-9-21c-12-7-14-16-10-23 8 5 12 13 10 23Zm7 17c-2-13 2-21 11-23 2 12-2 20-11 23Zm-9-24c-2-12 2-20 9-24 5 10 2 19-9 24Z"
        fill="#869c4a"
        stroke="#536436"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="m35 170 13 9m-12-35 5 12m16 3-6 13"
        stroke="#c4cc72"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
  )
}

/** Text-free coins with a shared struck-metal rim and distinct currency motifs. */
export function Coin({
  kind,
  size = 180,
  label,
}: {
  kind: 'bonsai' | 'tuna' | 'bitcoin'
  size?: number
  label?: string
}) {
  const id = useId()
  const [light, mid, shade, ink] =
    kind === 'tuna'
      ? ['#f5f8fb', '#c1cbd4', '#788997', '#435663']
      : ['#fff1aa', '#e7b650', '#a77422', '#725023']
  return (
    <div
      className={`vision-coin coin-${kind} coin-illustrated`}
      style={{ width: size, height: size, padding: 0, border: 0 }}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 256 256"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${id}-rim`}
            x1="30"
            y1="20"
            x2="221"
            y2="240"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor={light} />
            <stop offset=".27" stopColor={mid} />
            <stop offset=".48" stopColor={light} />
            <stop offset=".71" stopColor={shade} />
            <stop offset="1" stopColor={mid} />
          </linearGradient>
          <radialGradient id={`${id}-face`} cx=".36" cy=".25" r=".84">
            <stop stopColor={kind === 'bitcoin' ? '#ffb044' : light} />
            <stop
              offset=".54"
              stopColor={kind === 'bitcoin' ? '#f7931a' : mid}
            />
            <stop
              offset="1"
              stopColor={kind === 'bitcoin' ? '#d9770d' : shade}
            />
          </radialGradient>
        </defs>
        <circle
          cx="128"
          cy="130"
          r="122"
          fill={shade}
          stroke={ink}
          strokeWidth="3"
        />
        <circle
          cx="128"
          cy="125"
          r="120"
          fill={`url(#${id}-rim)`}
          stroke={ink}
          strokeWidth="3"
        />
        <circle cx="128" cy="125" r="115" stroke={light} strokeWidth="2" />
        {Array.from({ length: 60 }, (_, i) => (
          <path
            key={i}
            d="M128 12v5"
            transform={`rotate(${i * 6} 128 125)`}
            stroke={ink}
            strokeOpacity=".42"
            strokeWidth="1.5"
          />
        ))}
        <circle
          cx="128"
          cy="125"
          r="106"
          fill={`url(#${id}-face)`}
          stroke={ink}
          strokeWidth="2.5"
        />
        <circle
          cx="128"
          cy="125"
          r="102.5"
          stroke={light}
          strokeOpacity=".7"
          strokeWidth="1.5"
        />
        <path
          d="M49 72a96 96 0 0 1 126-31"
          stroke="#fff"
          strokeOpacity=".24"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <path
          d="M68 208a102 102 0 0 0 126-12"
          stroke={ink}
          strokeOpacity=".16"
          strokeWidth="3"
          strokeLinecap="round"
        />
        {kind === 'bonsai' && (
          <>
            <g transform="translate(35 17)">
              <BonsaiArtwork size={186} />
            </g>
            <CoinSprig />
            <CoinSprig flip />
            <path d="m124 207 4-5 4 5-4 5Z" fill={ink} opacity=".55" />
          </>
        )}
        {kind === 'tuna' && (
          <g transform="translate(31 27)">
            <TunaArtwork size={194} />
          </g>
        )}
        {kind === 'bitcoin' && (
          <g transform="translate(31 27)">
            <BitcoinArtwork size={194} />
          </g>
        )}
      </svg>
    </div>
  )
}
