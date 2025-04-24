"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../components/atoms/Button/Button"
import GameBoard from "../GameBoard/GameBoard"
import type { Ship } from "../../../utils/Types"
import { RotateCw, Shuffle, Play } from "lucide-react"
import "./GameSetup.css"

interface GameSetupProps {
  onShipsPlaced: (ships: Ship[]) => void
  onRandomize: () => void
  onRotate: () => void
  onStartGame?: () => void
  ships?: Ship[]
  isRotated?: boolean
}

interface Position {
  x: number
  y: number
}

export const GameSetup: React.FC<GameSetupProps> = ({
  onShipsPlaced,
  onRandomize,
  onRotate,
  onStartGame,
  ships = [],
  isRotated = false,
}) => {
  const initialShips: Ship[] = [
    { id: 1, type: "carrier", size: 5, positions: [], isSunk: false },
    { id: 2, type: "battleship", size: 4, positions: [], isSunk: false },
    { id: 3, type: "cruiser", size: 3, positions: [], isSunk: false },
    { id: 4, type: "submarine", size: 3, positions: [], isSunk: false },
    { id: 5, type: "destroyer", size: 2, positions: [], isSunk: false },
  ]

  const [selectedShipId, setSelectedShipId] = useState<number | null>(null)
  const [placementMode, setPlacementMode] = useState<boolean>(false)
  const [currentShips, setCurrentShips] = useState<Ship[]>(ships.length > 0 ? ships : initialShips)

  
  useEffect(() => {
    if (ships.length > 0) {
      setCurrentShips(ships)
    }
  }, [ships])

  const handleShipSelect = (shipId: number) => {
    setSelectedShipId(shipId)
    setPlacementMode(true)
  }

  const handleRotateShip = () => {
    onRotate()
  }

  const handleRandomize = () => {
    onRandomize()
  }

  const handleCellClick = (x: number, y: number) => {
    if (!placementMode || selectedShipId === null) return

    const selectedShip = currentShips.find((ship) => ship.id === selectedShipId)
    if (!selectedShip) return

    
    if (!isValidPlacement(selectedShip, x, y, isRotated)) return

    
    const positions: Position[] = []
    for (let i = 0; i < selectedShip.size; i++) {
      if (isRotated) {
        positions.push({ x, y: y + i })
      } else {
        positions.push({ x: x + i, y })
      }
    }

    
    const updatedShips = currentShips.map((ship) => (ship.id === selectedShipId ? { ...ship, positions } : ship))
    setCurrentShips(updatedShips)

    
    onShipsPlaced(updatedShips)

    
    setSelectedShipId(null)
    setPlacementMode(false)
  }

  
  const isValidPlacement = (ship: Ship, x: number, y: number, rotated: boolean): boolean => {
    
    if (rotated) {
      if (y + ship.size > 10) return false
    } else {
      if (x + ship.size > 10) return false
    }

    
    for (let i = 0; i < ship.size; i++) {
      const checkX = rotated ? x : x + i
      const checkY = rotated ? y + i : y

      
      for (const existingShip of currentShips) {
        if (existingShip.id === ship.id) continue 

        if (existingShip.positions.some((pos) => pos.x === checkX && pos.y === checkY)) {
          return false
        }
      }
    }

    return true
  }

  const allShipsPlaced = currentShips.every((ship) => ship.positions.length > 0)

  
  const selectedShipSize = selectedShipId ? currentShips.find((ship) => ship.id === selectedShipId)?.size || 0 : 0

  return (
    <div className="game-setup">
      <h2 className="game-setup-title">Place Your Ships</h2>

      <div className="game-setup-container">
        <div className="game-setup-board">
          <GameBoard
            ships={currentShips}
            isPlayerBoard={true}
            onCellClick={handleCellClick}
            disabled={!placementMode}
            gamePhase="setup"
            selectedShipSize={selectedShipSize}
            isRotated={isRotated}
          />

          <div className="game-setup-controls">
            <Button onClick={handleRotateShip} className="rotate-btn" disabled={!placementMode}>
              <RotateCw className="mr-2 h-4 w-4" />
              Rotate Ship
            </Button>
            <Button onClick={handleRandomize} className="randomize-btn">
              <Shuffle className="mr-2 h-4 w-4" />
              Randomize
            </Button>
          </div>
        </div>

        <div className="game-setup-ships">
          <h3 className="ships-title">Your Fleet</h3>
          <div className="ships-list">
            {currentShips.map((ship) => (
              <div
                key={ship.id}
                className={`ship-item ${ship.positions.length > 0 ? "placed" : ""} ${
                  selectedShipId === ship.id ? "selected" : ""
                }`}
                onClick={() => ship.positions.length === 0 && handleShipSelect(ship.id)}
              >
                <div className="ship-name">{ship.type}</div>
                <div className="ship-size">
                  {Array.from({ length: ship.size }).map((_, i) => (
                    <div key={i} className="ship-unit" />
                  ))}
                </div>
                <div className="ship-status">{ship.positions.length > 0 ? "Placed" : "Not Placed"}</div>
              </div>
            ))}
          </div>

          <div className="setup-status">
            {allShipsPlaced ? (
              <div className="ready-container">
                <div className="ready-message">All ships placed! Ready to start.</div>
                {onStartGame && (
                  <Button onClick={onStartGame} className="start-game-btn">
                    <Play className="mr-2 h-4 w-4" />
                    Start Game
                  </Button>
                )}
              </div>
            ) : (
              <div className="instruction-message">
                Select a ship and place it on the board. {isRotated ? "Vertical" : "Horizontal"} placement is active.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameSetup
