export type SceneId =
  | 'architecture-core-server'
  | 'architecture-core-mint'
  | 'architecture-core-connect'
  | 'architecture-core-transfer'
  | 'architecture-request-types'
  | 'architecture-messaging'
  | 'architecture-coins-data'
  | 'architecture-ping-pong'
  | 'architecture-bacoin-core'
  | 'architecture-guessing-game'
  | 'architecture-bitcoin-buy'
  | 'architecture-bitcoin-sell'
  | 'architecture-coffee-core'
  | 'architecture-native-trade'
  | 'architecture-bridge'

export type ArtworkBrief = {
  id: string
  title: string
  description: string
}

export type Slide = {
  id: string
  title: string
  sentence: string
  visual?: SceneId
  phases?: readonly [string, ...string[]]
  talkingPoints?: readonly string[]
  artwork?: readonly ArtworkBrief[]
}

export type Chapter = {
  id: string
  number: number
  title: string
  description: string
  sourcePath: string
  slides: readonly [Slide, ...Slide[]]
}
