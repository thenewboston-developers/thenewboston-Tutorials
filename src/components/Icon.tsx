type IconName =
  'arrow-left' | 'arrow-right' | 'chevron-right' | 'replay' | 'pause' | 'play'

const paths: Record<IconName, string> = {
  'arrow-left': 'M19 12H5m7-7-7 7 7 7',
  'arrow-right': 'M5 12h14m-7-7 7 7-7 7',
  'chevron-right': 'm9 5 7 7-7 7',
  replay: 'M3 9a9 9 0 1 1 .8 9M3 3v6h6',
  pause: 'M8 5v14M16 5v14',
  play: 'm7 4 13 8-13 8V4Z',
}

export function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name]} />
    </svg>
  )
}
