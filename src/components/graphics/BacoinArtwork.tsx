import { useId } from 'react'

export function BacoinArtwork({ size = 194 }: { size?: number }) {
  const id = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="creator-offering offering-bacoin"
    >
      <defs>
        <linearGradient id={`${id}-bacon`} x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#a4482f" />
          <stop offset=".42" stopColor="#db7952" />
          <stop offset="1" stopColor="#ac4b31" />
        </linearGradient>
      </defs>
      <g transform="rotate(25 128 128)">
        {[80, 128, 176].map((x, index) => (
          <g key={x} transform={`translate(${x} ${index === 1 ? 123 : 130})`}>
            <path
              d="M-18-78C-8-84 4-72 18-78C28-56 8-43 19-23C30-3 7 12 18 32C28 54 8 64 18 80C7 87-5 75-18 81C-28 58-7 44-18 24C-29 3-7-12-18-33C-29-54-8-64-18-78Z"
              fill="#794327"
              opacity=".16"
              transform="translate(3 4)"
            />
            <path
              d="M-18-78C-8-84 4-72 18-78C28-56 8-43 19-23C30-3 7 12 18 32C28 54 8 64 18 80C7 87-5 75-18 81C-28 58-7 44-18 24C-29 3-7-12-18-33C-29-54-8-64-18-78Z"
              fill={`url(#${id}-bacon)`}
              stroke="#753d28"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M-9-73C1-56-15-44-6-26C4-7-15 6-6 25C3 46-14 58-5 76"
              stroke="#f6d5a1"
              strokeWidth="8"
              strokeLinecap="round"
            />
            <path
              d="M7-70C15-52 1-44 10-26C20-7 0 8 9 29C18 48 2 62 9 74"
              stroke="#edba83"
              strokeWidth="5.5"
              strokeLinecap="round"
            />
            <path
              d="M-16-57q-3 9 1 16m29 43q-3 8-1 14m-27 43q-1 7 2 13"
              stroke="#e39868"
              strokeWidth="2.3"
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  )
}
