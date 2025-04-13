import React from "react"
import { GridRow } from "../molecules/GridRow"
import { Text } from "../atoms/Text"

interface GameBoardProps {
  grid: string[][]
  isOpponent?: boolean
  onCellClick?: (x: number, y: number) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (x: number, y: number) => void
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  isOpponent = false,
  onCellClick,
  onDragOver,
  onDrop,
}) => {
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

  const handleCellClick = (x: number, y: number) => {
    if (onCellClick) onCellClick(x, y)
  }

  const handleCellDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    if (onDragOver) onDragOver(e)
  }

  const handleCellDrop = (x: number, y: number) => {
    if (onDrop) onDrop(x, y)
  }

  return (
    <div style={{ marginBottom: "2rem" }}>
      <Text variant="h2" style={{ marginBottom: "0.5rem" }}>
        {isOpponent ? "Opponent's Board" : "Your Board"}
      </Text>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {grid.map((_, index) => (
            <Text
              key={index}
              style={{ height: "50px", display: "flex", alignItems: "center" }}
            >
              {index + 1}
            </Text>
          ))}
        </div>
        <div>
          <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
            {labels.map((label) => (
              <Text key={label} style={{ width: "50px", textAlign: "center" }}>
                {label}
              </Text>
            ))}
          </div>
          {grid.map((row, rowIndex) => (
            <GridRow
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onCellClick={onCellClick ? handleCellClick : undefined}
              onDragOver={onDragOver ? handleCellDragOver : undefined}
              onDrop={onDrop ? handleCellDrop : undefined}
              isOpponent={isOpponent}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
