import React from "react"
import { GridCell } from "../atoms/GridCell"

interface GridRowProps {
  row: string[]
  rowIndex: number
  onCellClick?: (x: number, y: number) => void
  isOpponent?: boolean
}

export const GridRow: React.FC<GridRowProps> = ({
  row,
  rowIndex,
  onCellClick,
  isOpponent,
}) => {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
      {row.map((cell, colIndex) => (
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          state={cell as "empty" | "ship" | "hit" | "miss"}
          onClick={() => onCellClick && onCellClick(colIndex, rowIndex)}
          isOpponent={isOpponent}
        />
      ))}
    </div>
  )
}
