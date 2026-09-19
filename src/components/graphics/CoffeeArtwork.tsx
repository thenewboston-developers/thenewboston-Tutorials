import { useId } from 'react'

export function CoffeeArtwork({ size = 194 }: { size?: number }) {
  const id = useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="creator-offering offering-coffee"
    >
      <defs>
        <linearGradient id={`${id}-ceramic`} x1="0" y1="0" x2="1" y2=".5">
          <stop stopColor="#fffaf0" />
          <stop offset=".55" stopColor="#f7e9cd" />
          <stop offset="1" stopColor="#c9b48f" />
        </linearGradient>
        <linearGradient id={`${id}-glaze`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#398c8b" />
          <stop offset=".55" stopColor="#25676e" />
          <stop offset="1" stopColor="#17464e" />
        </linearGradient>
        <linearGradient id={`${id}-bean`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ad6b42" />
          <stop offset=".5" stopColor="#78412b" />
          <stop offset="1" stopColor="#442d24" />
        </linearGradient>
      </defs>

      <g stroke="#72513a" strokeWidth="4.5" strokeLinecap="round">
        <path d="M89 79C74 64 105 58 93 40" />
        <path d="M124 77C108 62 143 50 128 30" />
        <path d="M157 80C145 68 172 60 163 47" />
      </g>

      <ellipse cx="129" cy="191" rx="84" ry="18" fill="#76522d" opacity=".2" />
      <path
        d="M45 179Q48 201 126 204Q207 204 215 180Z"
        fill="#266770"
        stroke="#344e4c"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <ellipse
        cx="130"
        cy="179"
        rx="85"
        ry="19"
        fill={`url(#${id}-ceramic)`}
        stroke="#344e4c"
        strokeWidth="3.5"
      />
      <ellipse
        cx="128"
        cy="177"
        rx="56"
        ry="11"
        stroke="#b5a788"
        strokeWidth="2.5"
      />

      <path
        d="M184 104C224 96 232 124 214 145Q200 161 181 156L184 143C198 145 207 137 208 127Q209 113 184 118Z"
        fill={`url(#${id}-ceramic)`}
        stroke="#344e4c"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M62 105L69 150C72 174 88 184 123 185C157 184 176 174 179 151L186 105Z"
        fill={`url(#${id}-ceramic)`}
        stroke="#344e4c"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M67 143Q123 160 181 143L179 151C176 174 157 184 123 185C88 184 72 174 69 150Z"
        fill={`url(#${id}-glaze)`}
        stroke="#344e4c"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="m78 123 4 22m2 14q4 11 16 15"
        stroke="#fffdf2"
        strokeWidth="5"
        strokeLinecap="round"
        opacity=".65"
      />
      <ellipse
        cx="124"
        cy="105"
        rx="62"
        ry="19"
        fill="#fff5de"
        stroke="#344e4c"
        strokeWidth="4"
      />
      <ellipse cx="124" cy="106" rx="52" ry="12" fill="#543628" />
      <path
        d="M83 106Q105 94 144 100"
        stroke="#ae7f51"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      <g transform="rotate(-32 62 196)">
        <ellipse
          cx="62"
          cy="196"
          rx="14"
          ry="22"
          fill={`url(#${id}-bean)`}
          stroke="#503829"
          strokeWidth="3"
        />
        <path
          d="M64 177C51 186 72 198 60 215"
          stroke="#e1ac72"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </g>
      <g transform="rotate(47 88 210)">
        <ellipse
          cx="88"
          cy="210"
          rx="12"
          ry="18"
          fill={`url(#${id}-bean)`}
          stroke="#503829"
          strokeWidth="3"
        />
        <path
          d="M90 195C80 201 97 211 86 225"
          stroke="#d9a16b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  )
}
