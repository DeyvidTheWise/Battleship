"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { Ship, Cell, GameMode, GameState, Player } from "../utils/Types"
import type { Difficulty } from "../utils/AiStrategy"
import { playSound } from "../utils/SoundEffects"
import { apiClient } from "../utils/ApiClient"
import { useAuth } from "./AuthContext"

type CellStatus = "empty" | "ship" | "hit" | "miss"
interface Position {
  x: number
  y: number
}

interface GameContextType {
  gameState: GameState
  currentPlayer: Player
  player1Board: Cell[][]
  player2Board: Cell[][]
  player1Ships: Ship[]
  player2Ships: Ship[]
  selectedShip: Ship | null
  isRotated: boolean
  aiDifficulty: Difficulty
  gameMode: GameMode
  gameStartTime: number | null
  gameEndTime: number | null
  shotsFired: number
  shotsHit: number
  shipsSunk: number
  winner: Player | null
  setGameMode: (mode: GameMode) => void
  setAIDifficulty: (difficulty: Difficulty) => void
  startGame: () => void
  resetGame: () => void
  selectShip: (ship: Ship) => void
  rotateShip: () => void
  placeShip: (x: number, y: number) => boolean
  autoPlaceShips: () => void
  makeMove: (x: number, y: number) => void
  isValidPlacement: (ship: Ship, x: number, y: number, isRotated: boolean) => boolean
  
  socket?: any
  roomId?: string
  makeShot?: (x: number, y: number) => void
  setReady?: (ships: Ship[]) => void
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export const useGame = () => {
  const context = useContext(GameContext)

  if (!context) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}

interface GameProviderProps {
  children: React.ReactNode
}

export const GameProvider: React.FC<GameProviderProps> = ({ children }) => {
  const { user } = useAuth()
  const [gameState, setGameState] = useState<GameState>("setup")
  const [currentPlayer, setCurrentPlayer] = useState<Player>("player1")
  const [player1Board, setPlayer1Board] = useState<Cell[][]>([])
  const [player2Board, setPlayer2Board] = useState<Cell[][]>([])
  const [player1Ships, setPlayer1Ships] = useState<Ship[]>([])
  const [player2Ships, setPlayer2Ships] = useState<Ship[]>([])
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null)
  const [isRotated, setIsRotated] = useState(false)
  const [aiDifficulty, setAIDifficulty] = useState<Difficulty>("medium")
  const [gameMode, setGameMode] = useState<GameMode>("ai")
  const [winner, setWinner] = useState<Player | null>(null)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [gameEndTime, setGameEndTime] = useState<number | null>(null)
  const [shotsFired, setShotsFired] = useState(0)
  const [shotsHit, setShotsHit] = useState(0)
  const [shipsSunk, setShipsSunk] = useState(0)
  const [socket, setSocket] = useState<any>(null)
  const [roomId, setRoomId] = useState<string | undefined>(undefined)


  const initializeBoards = useCallback(() => {
    const createEmptyBoard = (): Cell[][] => {
      return Array(10)
        .fill(null)
        .map(() =>
          Array(10)
            .fill(null)
            .map(() => ({ status: "empty" as CellStatus, ship: null })),
        )
    }

    setPlayer1Board(createEmptyBoard())
    setPlayer2Board(createEmptyBoard())
  }, [])


  const initializeShips = useCallback(() => {
    const createShips = (): Ship[] => {
      return [
        { id: 1, type: "carrier", size: 5, positions: [], isSunk: false },
        { id: 2, type: "battleship", size: 4, positions: [], isSunk: false },
        { id: 3, type: "cruiser", size: 3, positions: [], isSunk: false },
        { id: 4, type: "submarine", size: 3, positions: [], isSunk: false },
        { id: 5, type: "destroyer", size: 2, positions: [], isSunk: false },
      ]
    }

    setPlayer1Ships(createShips())
    setPlayer2Ships(createShips())
    setSelectedShip(null)
  }, [])

  
  const resetGame = useCallback(() => {
    initializeBoards()
    initializeShips()
    setGameState("setup")
    setCurrentPlayer("player1")
    setIsRotated(false)
    setWinner(null)
    setGameStartTime(null)
    setGameEndTime(null)
    setShotsFired(0)
    setShotsHit(0)
    setShipsSunk(0)
  }, [initializeBoards, initializeShips])

  
  useEffect(() => {
    resetGame()
  }, [resetGame])

  
  const selectShip = (ship: Ship) => {
    setSelectedShip(ship)
  }

  
  const rotateShip = () => {
    setIsRotated(!isRotated)
    playSound("rotate")
  }

  
  const isValidPlacement = (ship: Ship, x: number, y: number, rotated: boolean): boolean => {
    if (!ship) return false

    
    if (ship.positions.length > 0) return false

    
    if (rotated) {
      if (y + ship.size > 10) return false
    } else {
      if (x + ship.size > 10) return false
    }

    
    for (let i = 0; i < ship.size; i++) {
      const checkX = rotated ? x : x + i
      const checkY = rotated ? y + i : y
      if (player1Board[checkY][checkX].status !== "empty") {
        return false
      }
    }

    return true
  }

  
  const placeShip = (x: number, y: number): boolean => {
    if (!selectedShip || !isValidPlacement(selectedShip, x, y, isRotated)) {
      return false
    }

    
    const newShip = { ...selectedShip, positions: [] as Position[] }
    for (let i = 0; i < selectedShip.size; i++) {
      const posX = isRotated ? x : x + i
      const posY = isRotated ? y + i : y
      newShip.positions.push({ x: posX, y: posY })
    }

    
    const updatedShips = player1Ships.map((ship) => (ship.id === newShip.id ? newShip : ship))
    setPlayer1Ships(updatedShips)

    
    const newBoard = [...player1Board]
    for (let i = 0; i < selectedShip.size; i++) {
      const posX = isRotated ? x : x + i
      const posY = isRotated ? y + i : y
      newBoard[posY][posX] = { status: "ship" as CellStatus, ship: selectedShip as any }
    }
    setPlayer1Board(newBoard)

    
    playSound("place")

    
    setSelectedShip(null)

    return true
  }

  
  const autoPlaceShips = (): void => {
    
    const newBoard = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ status: "empty" as CellStatus, ship: null })),
      )

    
    const newShips = [
      { id: 1, type: "carrier", size: 5, positions: [], isSunk: false },
      { id: 2, type: "battleship", size: 4, positions: [], isSunk: false },
      { id: 3, type: "cruiser", size: 3, positions: [], isSunk: false },
      { id: 4, type: "submarine", size: 3, positions: [], isSunk: false },
      { id: 5, type: "destroyer", size: 2, positions: [], isSunk: false },
    ] as Ship[]

    
    for (const ship of newShips) {
      let placed = false
      let attempts = 0
      const maxAttempts = 100

      while (!placed && attempts < maxAttempts) {
        attempts++
        const x = Math.floor(Math.random() * 10)
        const y = Math.floor(Math.random() * 10)
        const rotated = Math.random() > 0.5

        
        if ((rotated && y + ship.size <= 10) || (!rotated && x + ship.size <= 10)) {
          let valid = true

          
          for (let i = 0; i < ship.size; i++) {
            const checkX = rotated ? x : x + i
            const checkY = rotated ? y + i : y
            if (newBoard[checkY][checkX].status !== "empty") {
              valid = false
              break
            }
          }

          if (valid) {
            
            const positions: Position[] = []
            for (let i = 0; i < ship.size; i++) {
              const posX = rotated ? x : x + i
              const posY = rotated ? y + i : y
              positions.push({ x: posX, y: posY })
              newBoard[posY][posX] = { status: "ship" as CellStatus, ship: ship as any }
            }

            
            ship.positions = positions
            placed = true
          }
        }
      }

      if (!placed) {
        
        return autoPlaceShips()
      }
    }

    
    setPlayer1Board(newBoard)
    setPlayer1Ships(newShips)
    playSound("place")
  }

  
  const autoPlaceAIShips = useCallback((): void => {
    
    const newBoard = Array(10)
      .fill(null)
      .map(() =>
        Array(10)
          .fill(null)
          .map(() => ({ status: "empty" as CellStatus, ship: null })),
      )

    const newShips = [
      { id: 1, type: "carrier", size: 5, positions: [], isSunk: false },
      { id: 2, type: "battleship", size: 4, positions: [], isSunk: false },
      { id: 3, type: "cruiser", size: 3, positions: [], isSunk: false },
      { id: 4, type: "submarine", size: 3, positions: [], isSunk: false },
      { id: 5, type: "destroyer", size: 2, positions: [], isSunk: false },
    ] as Ship[]

    
    for (const ship of newShips) {
      let placed = false
      let attempts = 0
      const maxAttempts = 100

      while (!placed && attempts < maxAttempts) {
        attempts++
        const x = Math.floor(Math.random() * 10)
        const y = Math.floor(Math.random() * 10)
        const rotated = Math.random() > 0.5

        
        if ((rotated && y + ship.size <= 10) || (!rotated && x + ship.size <= 10)) {
          let valid = true

          
          for (let i = 0; i < ship.size; i++) {
            const checkX = rotated ? x : x + i
            const checkY = rotated ? y + i : y
            if (newBoard[checkY][checkX].status !== "empty") {
              valid = false
              break
            }
          }

          if (valid) {
            
            const positions: Position[] = []
            for (let i = 0; i < ship.size; i++) {
              const posX = rotated ? x : x + i
              const posY = rotated ? y + i : y
              positions.push({ x: posX, y: posY })
              newBoard[posY][posX] = { status: "ship" as CellStatus, ship: ship as any }
            }

            
            ship.positions = positions
            placed = true
          }
        }
      }

      if (!placed) {
        
        return autoPlaceAIShips()
      }
    }

    
    setPlayer2Board(newBoard)
    setPlayer2Ships(newShips)
  }, [])

  
  const startGame = () => {
    
    const allShipsPlaced = player1Ships.every((ship) => ship.positions.length > 0)
    if (!allShipsPlaced) {
      return
    }

    
    autoPlaceAIShips()

    
    setGameState("playing")
    setCurrentPlayer("player1")
    setGameStartTime(Date.now())
  }

  
  const checkAllShipsSunk = (ships: Ship[]): boolean => {
    return ships.every((ship) => ship.isSunk)
  }

  
  const updateShipStatus = (board: Cell[][], ships: Ship[]): Ship[] => {
    return ships.map((ship) => {
      if (ship.isSunk) return ship

      const allPositionsHit = ship.positions.every((pos) => {
        return board[pos.y][pos.x].status === "hit"
      })

      if (allPositionsHit && !ship.isSunk) {
        
        playSound("sunk")
        setShipsSunk((prev) => prev + 1)
        return { ...ship, isSunk: true }
      }

      return ship
    })
  }

  
  const makeMove = (x: number, y: number) => {
    if (gameState !== "playing" || currentPlayer !== "player1") return

    
    if (player2Board[y][x].status === "hit" || player2Board[y][x].status === "miss") {
      return
    }

    
    setShotsFired((prev) => prev + 1)

    
    const newBoard = [...player2Board]
    const cell = newBoard[y][x]

    if (cell.status === "ship") {
      
      newBoard[y][x] = { ...cell, status: "hit" }
      playSound("hit")
      setShotsHit((prev) => prev + 1)
    } else {
      
      newBoard[y][x] = { ...cell, status: "miss" }
      playSound("miss")
    }

    setPlayer2Board(newBoard)

    
    const updatedShips = updateShipStatus(newBoard, player2Ships)
    setPlayer2Ships(updatedShips)

    
    if (checkAllShipsSunk(updatedShips)) {
      setWinner("player1")
      setGameState("gameover")
      setGameEndTime(Date.now())
      playSound("victory")

      
      if (user) {
        const gameDuration = (Date.now() - (gameStartTime || Date.now())) / 1000
        apiClient
          .post("/api/statistics/record", {
            game_mode: `ai-${aiDifficulty}`,
            result: "win",
            shots_fired: shotsFired,
            shots_hit: shotsHit,
            ships_sunk: shipsSunk,
            game_duration: gameDuration,
          })
          .catch((err) => console.error("Error recording game:", err))

        
        apiClient.post("/api/achievements/check").catch((err) => console.error("Error checking achievements:", err))
      }
    } else {
      
      setCurrentPlayer("player2")
    }
  }

  
  const makeShot = (x: number, y: number) => {
    console.log("Making shot at", x, y)
  }

  const setReady = (ships: Ship[]) => {
    console.log("Setting ready with ships", ships)
  }

  const value = {
    gameState,
    currentPlayer,
    player1Board,
    player2Board,
    player1Ships,
    player2Ships,
    selectedShip,
    isRotated,
    aiDifficulty,
    gameMode,
    gameStartTime,
    gameEndTime,
    shotsFired,
    shotsHit,
    shipsSunk,
    winner,
    setGameMode,
    setAIDifficulty,
    startGame,
    resetGame,
    selectShip,
    rotateShip,
    placeShip,
    autoPlaceShips,
    makeMove,
    isValidPlacement,
    
    socket,
    roomId,
    makeShot,
    setReady,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}
