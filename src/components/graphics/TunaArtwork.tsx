import { useId } from 'react'

export function TunaArtwork({ size = 194 }: { size?: number }) {
  const id = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="creator-offering offering-tuna"
    >
      <defs>
        <linearGradient id={`${id}-body`} x1="0" y1="0" x2=".15" y2="1">
          <stop stopColor="#123c60" />
          <stop offset=".42" stopColor="#246b96" />
          <stop offset=".67" stopColor="#43a9b6" />
          <stop offset="1" stopColor="#b9e1dc" />
        </linearGradient>
        <linearGradient id={`${id}-fin`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#286b93" />
          <stop offset="1" stopColor="#143f65" />
        </linearGradient>
      </defs>

      <g stroke="#173e5b" strokeWidth="3.5" strokeLinejoin="round">
        <path
          d="M74 119C51 102 34 79 23 68C25 92 40 115 48 131C36 147 25 172 23 192C43 175 55 153 75 141Z"
          fill={`url(#${id}-fin)`}
        />
        <path
          d="M101 103C109 87 125 63 141 57C137 74 140 88 156 95Z"
          fill={`url(#${id}-fin)`}
        />
        <path d="m162 96 20-19 2 29Z" fill="#397f9e" />
        <path d="m111 155 24 35 14-34Z" fill="#2d7192" />
        <path d="m164 156 17 18 1-28Z" fill="#3c8eaa" />
        <path
          d="M67 126C95 86 154 78 205 109Q221 116 229 127Q219 139 211 145C164 177 110 173 68 137L55 133Z"
          fill={`url(#${id}-body)`}
        />
      </g>

      <path
        d="M68 126C101 85 159 80 205 109C167 94 119 104 82 132Z"
        fill="#153f68"
      />
      <path
        d="M85 138C128 151 177 147 216 135C180 165 128 169 85 138Z"
        fill="#b8ded7"
        opacity=".9"
      />
      <path
        d="M76 131C111 116 145 114 181 120"
        stroke="#75c5d0"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M175 107C164 121 168 138 180 147"
        stroke="#164969"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        d="M161 129C142 143 126 154 111 169C143 161 163 148 174 134Z"
        fill="#1e577c"
        stroke="#173e5b"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M160 136 129 157"
        stroke="#589eb9"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="m81 112 3-9 6 4m3-6 4-9 6 4m-24 48 4 9 6-3m5 7 5 8 6-3"
        fill="#4d95aa"
        stroke="#245775"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <circle
        cx="199"
        cy="120"
        r="7.5"
        fill="#d3ece7"
        stroke="#173e5b"
        strokeWidth="2"
      />
      <circle cx="201" cy="120" r="4" fill="#102f48" />
      <circle cx="202" cy="118" r="1.5" fill="#fff" />
      <path
        d="m229 127-17 3"
        stroke="#173e5b"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path
        d="m29 78 29 45m-29 57 28-44"
        stroke="#5c9ebc"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  )
}
