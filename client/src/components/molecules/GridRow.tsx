import React from "react"
import { GridCell } from "../atoms/GridCell"

interface GridRowProps {
  row: string[]
  rowIndex: number
  onCellClick?: (x: number, y: number) => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (x: number, y: number) => void
  isOpponent?: boolean
}

export const GridRow: React.FC<GridRowProps> = ({
  row,
  rowIndex,
  onCellClick,
  onDragOver,
  onDrop,
  isOpponent,
}) => {
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
    <div style={{ display: "flex", gap: "2px", marginBottom: "2px" }}>
      {row.map((cell, colIndex) => (
        <GridCell
          key={`${rowIndex}-${colIndex}`}
          state={cell as "empty" | "ship" | "hit" | "miss"}
          onClick={() => handleCellClick(colIndex, rowIndex)}
          onDragOver={handleCellDragOver}
          onDrop={() => handleCellDrop(colIndex, rowIndex)}
          isOpponent={isOpponent}
        />
      ))}
    </div>
  )
}
