import { useId } from 'react'

function Foliage({
  x,
  y,
  scale = 1,
}: {
  x: number
  y: number
  scale?: number
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M-36 10c-11-8-5-20 5-20-2-12 9-19 19-13 5-16 26-15 30-2 13-5 25 6 22 16 15 0 20 14 9 23-13 9-30 9-41 5-16 5-34 3-44-9Z"
        fill="#1e573d"
        stroke="#224534"
        strokeWidth="3"
      />
      <path
        d="M-31-4c-1-6 5-9 11-7 1-11 15-13 22-6 4-10 18-8 21 1 10-3 16 5 13 12-16 7-40 9-67 0Z"
        fill="#398856"
      />
      <path
        d="m-25-5 4-6m8 4 3-7m10 6 3-8m9 8 3-6m10 9 4-5m-45 16 4-5m11 5 3-5m10 5 4-5m10 5 3-5"
        stroke="#8eb956"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
    </g>
  )
}

export function BonsaiArtwork({ size = 180 }: { size?: number }) {
  const id = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="creator-offering offering-bonsai"
    >
      <defs>
        <linearGradient id={`${id}-pot`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#6f9270" />
          <stop offset="1" stopColor="#304e42" />
        </linearGradient>
      </defs>
      <ellipse cx="128" cy="228" rx="93" ry="10" fill="#173c35" opacity=".1" />
      <>
        <path
          d="M111 197c23-13 13-31 9-46-5-18 21-23 16-38-3-9-14-16-11-34l15-2c-6 15 11 25 10 40-1 21-28 22-22 43 4 16 7 26 23 38Z"
          fill="#956c41"
          stroke="#513e2b"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M126 151c-11-20-25-22-42-33m48 9c18-19 30-17 43-20m-39-1c-16-7-23-11-33-21m34 8 13-24"
          stroke="#513e2b"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M126 194c10-14 3-27 0-40s6-21 15-31c9-13-9-26-8-42m-13 69c-7-17-21-22-33-30m49 5c17-15 27-16 37-17"
          stroke="#ccab71"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <Foliage x={81} y={112} scale={0.84} />
        <Foliage x={179} y={102} scale={0.87} />
        <Foliage x={106} y={76} scale={0.72} />
        <Foliage x={148} y={57} scale={0.81} />
        <path
          d="M65 195q17-15 38-8 9-11 21-3 11-7 21 2 20-8 41 9"
          fill="#5c8d36"
          stroke="#395d2d"
          strokeWidth="3"
        />
        <path
          d="M81 190h4m18-4h4m40 5h4m19 0h3"
          stroke="#a9bc52"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <path
          d="m70 205 5 26h14l4-14m70-12-1 25h14l8-27"
          fill="#324c3d"
          stroke="#253c32"
          strokeWidth="4"
        />
        <path
          d="m57 194 12 28q60 14 119 0l12-28Z"
          fill={`url(#${id}-pot)`}
          stroke="#273f33"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M55 191q73 12 146 0l-3 12q-70 13-140 0Z"
          fill="#77966e"
          stroke="#2e4937"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M70 207h3m6 6 3 5m23-11h30"
          stroke="#a7be8d"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </>
    </svg>
  )
}
