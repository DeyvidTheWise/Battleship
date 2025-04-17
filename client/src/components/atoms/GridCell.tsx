import React from "react"

interface GridCellProps {
  state: "empty" | "ship" | "hit" | "miss"
  onClick?: () => void
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: () => void
  isOpponent?: boolean
  className?: string
  style?: React.CSSProperties
}

const GridCell: React.FC<GridCellProps> = ({
  state,
  onClick,
  onDragOver,
  onDrop,
  isOpponent = false,
  className = "",
  style,
}) => {
  const cellClass = state === "ship" && isOpponent ? "empty" : state

  return (
    <div
      className={`grid-cell ${cellClass} ${className}`}
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={style}
    >
      {state === "hit" && "X"}
      {state === "miss" && "O"}
    </div>
  )
}

export default GridCell
