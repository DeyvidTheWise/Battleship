export interface Coordinate {
  x: number
  y: number
}

export interface Ship {
  name: string
  size: number
  coordinates: Coordinate[]
  hits: number
  isSunk: boolean
  isHorizontal?: boolean // Added
  placed?: boolean // Added
}

export interface Player {
  id: string
  ships: Ship[]
  grid: string[][] // 'empty', 'ship', 'hit', 'miss'
}

export interface Game {
  id: string
  player1: Player
  player2: Player | null
  currentTurn: string
  status: "setup" | "playing" | "finished"
  winner: string | null
}
