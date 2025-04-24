
export * from "../utils/Types"




export type CellStatus = "empty" | "ship" | "hit" | "miss"


export interface Cell {
  status: CellStatus
  ship: Ship | null
}


export interface Position {
  x: number
  y: number
}


export type ShipType = "carrier" | "battleship" | "cruiser" | "submarine" | "destroyer"


export interface Ship {
  id: number
  type: ShipType
  size: number
  positions: Position[]
  isSunk: boolean
}


export type GameMode = "ai" | "multiplayer" | "practice"


export type GameState = "setup" | "playing" | "gameover"


export type Player = "player1" | "player2"


export interface GameStats {
  shotsFired: number
  shotsHit: number
  accuracy: number
  shipsSunk: number
  gameTime: number
}


export interface GameResult {
  winner: Player | null
  stats: GameStats
  timestamp: number
}


export interface GameSettings {
  soundEnabled: boolean
  soundVolume: number
  showHints: boolean
  showCoordinates: boolean
  autoRotateOnEdge: boolean
  confirmMoves: boolean
}


export interface GameHistoryEntry {
  id: string
  mode: GameMode
  result: "win" | "loss" | "draw"
  opponent: string
  date: string
  stats: GameStats
}
