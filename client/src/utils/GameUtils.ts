import type { Ship, Position } from "./Types"

export function generateRandomShips(existingPositions: string[] = []): Ship[] {
  const ships: Ship[] = [
    { id: 1, type: "carrier", size: 5, positions: [], isSunk: false },
    { id: 2, type: "battleship", size: 4, positions: [], isSunk: false },
    { id: 3, type: "cruiser", size: 3, positions: [], isSunk: false },
    { id: 4, type: "submarine", size: 3, positions: [], isSunk: false },
    { id: 5, type: "destroyer", size: 2, positions: [], isSunk: false },
  ]

  const boardSize = 10
  const occupiedPositions = new Set(existingPositions)

  for (const ship of ships) {
    let placed = false
    let attempts = 0
    const maxAttempts = 100

    while (!placed && attempts < maxAttempts) {
      attempts++
      const isHorizontal = Math.random() > 0.5

      
      const maxX = isHorizontal ? boardSize - ship.size : boardSize - 1
      const maxY = isHorizontal ? boardSize - 1 : boardSize - ship.size

      const startX = Math.floor(Math.random() * (maxX + 1))
      const startY = Math.floor(Math.random() * (maxY + 1))

      
      const positions: Position[] = []
      let valid = true

      for (let i = 0; i < ship.size; i++) {
        const x = isHorizontal ? startX + i : startX
        const y = isHorizontal ? startY : startY + i
        const posKey = `${x},${y}`

        if (occupiedPositions.has(posKey)) {
          valid = false
          break
        }

        positions.push({ x, y })
      }

      if (valid) {
        
        for (const pos of positions) {
          occupiedPositions.add(`${pos.x},${pos.y}`)
        }

        
        ship.positions = positions
        placed = true
      }
    }

    if (!placed) {
      
      return generateRandomShips(existingPositions)
    }
  }

  return ships
}

export function isValidPlacement(ship: Ship, x: number, y: number, isHorizontal: boolean, board: any[][]): boolean {
  const boardSize = board.length

  
  if (isHorizontal) {
    if (x + ship.size > boardSize) return false
  } else {
    if (y + ship.size > boardSize) return false
  }

  
  for (let i = 0; i < ship.size; i++) {
    const checkX = isHorizontal ? x + i : x
    const checkY = isHorizontal ? y : y + i

    if (board[checkY][checkX].status !== "empty") {
      return false
    }
  }

  return true
}

export function calculateAccuracy(hits: number, total: number): string {
  if (total === 0) return "0%"
  return `${Math.round((hits / total) * 100)}%`
}
