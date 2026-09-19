export function BitcoinArtwork({ size = 194 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 256 256"
      fill="none"
      aria-hidden="true"
      className="creator-offering offering-bitcoin"
    >
      <g transform="rotate(14 128 128) translate(-11 -3)" fill="#fff9e8">
        <path
          d="M110 37v27m22-27v27m-22 128v27m22-27v27"
          stroke="#fff9e8"
          strokeWidth="11"
        />
        <path
          fillRule="evenodd"
          d="M75 57h72c31 0 48 13 48 35 0 15-8 26-22 31 21 5 31 17 31 36 0 25-21 41-57 41H75v-19h15V76H75V57Zm41 21v38h26c18 0 28-7 28-19s-10-19-28-19h-26Zm0 59v41h31c20 0 31-7 31-21s-11-20-31-20h-31Z"
        />
      </g>
    </svg>
  )
}
