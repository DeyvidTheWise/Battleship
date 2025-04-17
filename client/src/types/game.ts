// client/src/@shared-types/game.ts
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
  isHorizontal: boolean
  placed: boolean
}

export interface Player {
  id: string
  ships: Ship[]
  grid: string[][]
}

export interface Game {
  id: string
  joinCode: string | null
  player1: Player
  player2: Player | null
  currentTurn: string
  status: "setup" | "playing" | "finished"
  winner: string | null
  createdAt: number
}
