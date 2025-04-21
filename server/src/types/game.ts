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

export interface Game {
  id: string
  joinCode: string | null
  player1: Player | null
  player2: Player | null
  currentTurn: string
  status: "setup" | "playing" | "finished"
  winner: string | null
  createdAt: number
  readyPlayers?: Set<string> // Add this to track ready players
}

export interface Player {
  id: string
  ships: ShipType[]
  grid: string[][]
  firstname?: string
  lastname?: string
}

export interface GameType {
  id: string
  joinCode: string | null
  player1: Player | null
  player2: Player | null
  currentTurn: string
  status: "setup" | "playing" | "finished"
  winner: string | null
  createdAt: number
}

export interface ShipType {
  name: string
  size: number
  coordinates: Coordinate[]
  hits: number
  isSunk: boolean
  isHorizontal: boolean
  placed: boolean
}

export interface Coordinate {
  x: number
  y: number
}
