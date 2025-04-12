export interface Ship {
  name: string
  size: number
  coordinates: { x: number; y: number }[]
  hits: number
  isSunk: boolean
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
}
