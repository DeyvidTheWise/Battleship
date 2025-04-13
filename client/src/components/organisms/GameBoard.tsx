import React from "react"

interface GameBoardProps {
  grid: string[][] // 'empty', 'ship', 'hit', 'miss'
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void
  onDrop?: (x: number, y: number) => void
  onCellClick?: (x: number, y: number) => void
  isOpponent?: boolean
}

const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onDragOver,
  onDrop,
  onCellClick,
  isOpponent,
}) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

  const cellStyle = (cell: string) => {
    // For opponent's board, treat 'ship' cells as 'empty' to hide them
    const displayCell = isOpponent && cell === "ship" ? "empty" : cell
    return {
      width: "40px",
      height: "40px",
      background:
        displayCell === "hit"
          ? "rgba(255, 0, 0, 0.7)"
          : displayCell === "miss"
          ? "rgba(0, 0, 255, 0.3)"
          : displayCell === "ship"
          ? "rgba(128, 128, 128, 0.8)"
          : "rgba(0, 119, 190, 0.5)",
      border: "1px solid #333",
      cursor:
        isOpponent && displayCell !== "hit" && displayCell !== "miss"
          ? "pointer"
          : "default",
      transition: "background 0.3s",
    }
  }

  const labelStyle = {
    width: "40px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontWeight: "bold",
    background: "transparent",
  }

  const handleClick = (x: number, y: number) => {
    if (
      isOpponent &&
      onCellClick &&
      grid[y][x] !== "hit" &&
      grid[y][x] !== "miss"
    ) {
      onCellClick(x, y)
    }
  }

  return (
    <div style={{ display: "inline-block", margin: "0 20px" }}>
      {/* Column Labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px repeat(10, 40px)",
          marginLeft: "40px",
        }}
      >
        <div /> {/* Empty top-left corner */}
        {columns.map((col, index) => (
          <div key={index} style={labelStyle}>
            {col}
          </div>
        ))}
      </div>
      {/* Grid with Row Labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "40px repeat(10, 40px)",
        }}
      >
        {grid.map((row, y) => (
          <React.Fragment key={y}>
            {/* Row Label */}
            <div style={labelStyle}>{y + 1}</div>
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                onDragOver={onDragOver}
                onDrop={() => onDrop && onDrop(x, y)}
                onClick={() => handleClick(x, y)}
                style={cellStyle(cell)}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

export default GameBoard
