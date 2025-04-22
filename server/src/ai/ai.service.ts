import { GameState } from "@shared-types"
import { getIO } from "../utils/socket"
import { SHIP_SIZES, isValidShip } from "../utils/constants"

export const makeAIMove = async (
  game_id: string,
  difficulty: "easy" | "medium" | "hard",
  opponentState: GameState
): Promise<{ cell: string; result: "hit" | "miss" }> => {
  // Simplified AI: Random shot
  const possibleCells: string[] = []
  for (let row = 1; row <= 10; row++) {
    for (let col = "A".charCodeAt(0); col <= "J".charCodeAt(0); col++) {
      const cell = `${String.fromCharCode(col)}${row}`
      if (!opponentState.shots.some((s) => s.cell === cell)) {
        possibleCells.push(cell)
      }
    }
  }

  if (possibleCells.length === 0) {
    throw new Error("No possible cells to shoot at")
  }

  const cell = possibleCells[Math.floor(Math.random() * possibleCells.length)]
  let hit = false
  for (const [ship, { position, orientation }] of Object.entries(
    opponentState.grid
  )) {
    // Validate the ship type
    if (!isValidShip(ship)) {
      console.warn(`Invalid ship type: ${ship}, skipping...`)
      continue // Skip invalid ships
    }

    const size = SHIP_SIZES[ship] // Now TypeScript knows size is defined
    const [col, row] = position.split("")
    const colIndex = col.charCodeAt(0) - "A".charCodeAt(0)
    const rowIndex = parseInt(row) - 1

    for (let i = 0; i < size; i++) {
      const targetCell =
        orientation === "horizontal"
          ? `${String.fromCharCode("A".charCodeAt(0) + colIndex + i)}${
              rowIndex + 1
            }`
          : `${col}${parseInt(row) + i}`
      if (targetCell === cell) {
        hit = true
        break
      }
    }
    if (hit) break
  }

  const result = hit ? "hit" : "miss"
  opponentState.shots.push({ cell, result })

  const io = getIO()
  io.emit("game-update", { game_id, shot: { cell, result } })

  return { cell, result }
}
