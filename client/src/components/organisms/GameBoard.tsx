import React from "react"
import { GridRow } from "../molecules/GridRow"
import { Text } from "../atoms/Text"

interface GameBoardProps {
  grid: string[][]
  isOpponent?: boolean
  onCellClick?: (x: number, y: number) => void
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  isOpponent = false,
  onCellClick,
}) => {
  const labels = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

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
              onCellClick={onCellClick}
              isOpponent={isOpponent}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
