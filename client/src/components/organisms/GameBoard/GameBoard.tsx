"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./GameBoard.css"
import type { Ship } from "../../../utils/Types"

interface Cell {
  x: number
  y: number
  status: "empty" | "ship" | "hit" | "miss"
  shipId?: number
  isPreview?: boolean
  isInvalid?: boolean
}

interface GameBoardProps {
  size?: number
  ships?: Ship[]
  isPlayerBoard?: boolean
  onCellClick?: (x: number, y: number) => void
  disabled?: boolean
  shots?: { [key: string]: "hit" | "miss" }
  gamePhase?: "setup" | "playing" | "ended"
  lastSunkShip?: Ship | null
  title?: string
  selectedShipSize?: number
  isRotated?: boolean
}

export const GameBoard: React.FC<GameBoardProps> = ({
  size = 10,
  ships = [],
  isPlayerBoard = false,
  onCellClick,
  disabled = false,
  shots = {},
  gamePhase = "playing",
  lastSunkShip = null,
  title,
  selectedShipSize = 0,
  isRotated = false,
}) => {
  
  const initializeBoard = (): Cell[][] => {
    const board: Cell[][] = []

    for (let y = 0; y < size; y++) {
      const row: Cell[] = []
      for (let x = 0; x < size; x++) {
        row.push({ x, y, status: "empty" })
      }
      board.push(row)
    }

    
    if (isPlayerBoard && ships.length > 0) {
      ships.forEach((ship) => {
        ship.positions.forEach((pos) => {
          if (board[pos.y] && board[pos.y][pos.x]) {
            board[pos.y][pos.x].status = "ship"
            board[pos.y][pos.x].shipId = ship.id
          }
        })
      })
    }

    
    Object.entries(shots).forEach(([key, result]) => {
      const [x, y] = key.split(",").map(Number)
      if (board[y] && board[y][x]) {
        board[y][x].status = result
      }
    })

    return board
  }

  const [board, setBoard] = useState<Cell[][]>(initializeBoard())
  const [hoverCell, setHoverCell] = useState<{ x: number; y: number } | null>(null)
  const boardRef = useRef<Cell[][]>(initializeBoard())

  
  useEffect(() => {
    boardRef.current = initializeBoard()
    setBoard(initializeBoard())
  }, [ships, shots, isPlayerBoard])

  
  const isValidPlacement = (x: number, y: number, shipSize: number, rotated: boolean): boolean => {
    if (shipSize <= 0) return true

    
    if (rotated) {
      if (y + shipSize > size) return false
    } else {
      if (x + shipSize > size) return false
    }

    
    for (let i = 0; i < shipSize; i++) {
      const checkX = rotated ? x : x + i
      const checkY = rotated ? y + i : y

      if (checkX >= size || checkY >= size) return false

      const cell = boardRef.current[checkY][checkX]
      if (cell.status === "ship") return false
    }

    return true
  }

  
  useEffect(() => {
    if (gamePhase !== "setup" || !isPlayerBoard || selectedShipSize <= 0 || !hoverCell) {
      return
    }

    const { x, y } = hoverCell
    const newBoard = JSON.parse(JSON.stringify(boardRef.current)) 
    const isValid = isValidPlacement(x, y, selectedShipSize, isRotated)

    
    for (let i = 0; i < selectedShipSize; i++) {
      const previewX = isRotated ? x : x + i
      const previewY = isRotated ? y + i : y

      if (previewX < size && previewY < size) {
        newBoard[previewY][previewX].isPreview = true
        newBoard[previewY][previewX].isInvalid = !isValid
      }
    }

    setBoard(newBoard)
  }, [hoverCell, selectedShipSize, isRotated, gamePhase, size, isPlayerBoard])

  const handleCellClick = (x: number, y: number) => {
    if (disabled || !onCellClick) return
    onCellClick(x, y)
  }

  const handleCellHover = (x: number, y: number) => {
    if (gamePhase === "setup" && isPlayerBoard && selectedShipSize > 0) {
      setHoverCell({ x, y })
    }
  }

  const handleCellLeave = () => {
    if (hoverCell) {
      setHoverCell(null)
      
      setBoard(boardRef.current)
    }
  }

  
  const getCellClass = (cell: Cell) => {
    let className = "cell"

    switch (cell.status) {
      case "ship":
        className += isPlayerBoard ? " ship" : ""
        break
      case "hit":
        className += " hit"
        break
      case "miss":
        className += " miss"
        break
      default:
        break
    }

    
    if (
      lastSunkShip &&
      cell.shipId === lastSunkShip.id &&
      lastSunkShip.positions.some((pos) => pos.x === cell.x && pos.y === cell.y)
    ) {
      className += " sunk"
    }

    
    if (cell.isPreview) {
      className += cell.isInvalid ? " invalid-placement" : " ship-preview"
    }

    
    if (disabled) {
      className += " disabled"
    }

    return className
  }

  
  const columnLabels = Array.from({ length: size }, (_, i) => String.fromCharCode(65 + i))

  
  const rowLabels = Array.from({ length: size }, (_, i) => i + 1)

  return (
    <div className="game-board-container">
      {title && <h3 className="game-board-title">{title}</h3>}

      <div className="game-board-labels">
        <div className="column-labels">
          {columnLabels.map((label) => (
            <div key={label} className="column-label">
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="game-board-grid">
        <div className="row-labels">
          {rowLabels.map((label) => (
            <div key={label} className="row-label">
              {label}
            </div>
          ))}
        </div>

        <div className="game-board" style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}>
          {board.flat().map((cell) => (
            <div
              key={`${cell.x}-${cell.y}`}
              className={getCellClass(cell)}
              onClick={() => handleCellClick(cell.x, cell.y)}
              onMouseEnter={() => handleCellHover(cell.x, cell.y)}
              onMouseLeave={handleCellLeave}
              data-x={cell.x}
              data-y={cell.y}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default GameBoard
