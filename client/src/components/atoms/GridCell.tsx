import React from "react"

interface GridCellProps {
  state: "empty" | "ship" | "hit" | "miss"
  onClick?: () => void
  isOpponent?: boolean
}

export const GridCell: React.FC<GridCellProps> = ({
  state,
  onClick,
  isOpponent = false,
}) => {
  const cellClass = state === "ship" && isOpponent ? "empty" : state

  return (
    <div className={`grid-cell ${cellClass}`} onClick={onClick}>
      {state === "hit" && "X"}
      {state === "miss" && "O"}
    </div>
  )
}
