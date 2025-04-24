"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import GameBoard from "../../components/organisms/GameBoard/GameBoard"
import GameSetup from "../../components/organisms/GameSetup/GameSetup"
import GameHeader from "../../components/organisms/GameHeader/GameHeader"
import ChatPanel from "../../components/organisms/ChatPanel/ChatPanel"
import ActionBar from "../../components/molecules/ActionBar/ActionBar"
import GameOverModal from "../../components/organisms/GameOverModal/GameOverModal"
import SettingsPanel from "../../components/organisms/SettingsPanel/SettingsPanel"
import type { Ship } from "../../utils/Types"
import { generateRandomShips } from "../../utils/GameUtils"
import { playSound } from "../../utils/SoundEffects"
import { useGame } from "../../contexts/GameContext"
import "./GamePage.css"

const mockAIKnowledge: {
  hitCells: Array<{ x: number; y: number }>
  missCells: Array<{ x: number; y: number }>
  potentialTargets: Array<{ x: number; y: number }>
  lastHitDirection: null | string
  sunkShips: number
} = {
  hitCells: [],
  missCells: [],
  potentialTargets: [],
  lastHitDirection: null,
  sunkShips: 0,
}

const GamePage: React.FC = () => {
  const params = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const mode = params.mode as string

  const queryParams = new URLSearchParams(location.search)
  const roomParam = queryParams.get("room")

  const [gamePhase, setGamePhase] = useState<"setup" | "playing" | "ended">(
    "setup"
  )
  const [playerShips, setPlayerShips] = useState<Ship[]>([])
  const [opponentShips, setOpponentShips] = useState<Ship[]>([])
  const [playerShots, setPlayerShots] = useState<{
    [key: string]: "hit" | "miss"
  }>({})
  const [opponentShots, setOpponentShots] = useState<{
    [key: string]: "hit" | "miss"
  }>({})
  const [currentTurn, setCurrentTurn] = useState<"player" | "opponent">(
    "player"
  )
  const [timer, setTimer] = useState<number>(60)
  const [winner, setWinner] = useState<"player" | "opponent" | null>(null)
  const [aiKnowledge, setAiKnowledge] = useState(mockAIKnowledge)
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium"
  )
  const [showSettings, setShowSettings] = useState(false)
  const [lastSunkShip, setLastSunkShip] = useState<Ship | null>(null)
  const [showGameOverModal, setShowGameOverModal] = useState(false)
  const [isRotated, setIsRotated] = useState(false)
  const [gameStartTime, setGameStartTime] = useState<number | null>(null)
  const [gameEndTime, setGameEndTime] = useState<number | null>(null)

  const [soundEnabled, setSoundEnabled] = useState(true)
  const [soundVolume, setSoundVolume] = useState(0.5)

  useEffect(() => {
    const validModes = ["multiplayer", "ai", "ai-anonymous", "practice"]
    if (!validModes.includes(mode)) {
      navigate("/")
    }
  }, [mode, navigate])

  const { gameState, currentPlayer, makeMove, resetGame } = useGame()

  const autoPlaceRemainingShips = useCallback(() => {
    const unplacedShips = playerShips.filter(
      (ship) => ship.positions.length === 0
    )

    if (unplacedShips.length > 0) {
      const existingPositions = playerShips
        .filter((ship) => ship.positions.length > 0)
        .flatMap((ship) => ship.positions.map((pos) => `${pos.x},${pos.y}`))

      const randomShips = generateRandomShips(existingPositions)

      const shipTypeToPositions = new Map()
      randomShips.forEach((ship) => {
        shipTypeToPositions.set(ship.type, ship.positions)
      })

      const updatedShips = playerShips.map((ship) => {
        if (ship.positions.length === 0) {
          const randomPositions = shipTypeToPositions.get(ship.type) || []
          return { ...ship, positions: randomPositions }
        }
        return ship
      })

      setPlayerShips(updatedShips)
      playSound("place", soundVolume, soundEnabled)
    }
  }, [playerShips, soundEnabled, soundVolume])

  useEffect(() => {
    if (timer <= 0) {
      if (gamePhase === "setup") {
        autoPlaceRemainingShips()

        setOpponentShips(generateRandomShips([]))

        setGamePhase("playing")
        setGameStartTime(Date.now())
        setTimer(30)
      } else if (gamePhase === "playing") {
        handleAutoShot()
        setTimer(30)
        setCurrentTurn(currentTurn === "player" ? "opponent" : "player")
      }
      return
    }

    if (timer === 10 && gamePhase === "playing") {
      playSound("timer-warning", soundVolume, soundEnabled)
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [
    timer,
    gamePhase,
    playerShips,
    currentTurn,
    soundEnabled,
    soundVolume,
    autoPlaceRemainingShips,
  ])

  const getAIShot = useCallback(() => {
    const availableCells = []
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cellKey = `${x},${y}`
        if (!opponentShots[cellKey]) {
          availableCells.push({ x, y })
        }
      }
    }

    if (availableCells.length === 0) return { x: 0, y: 0 }
    return availableCells[Math.floor(Math.random() * availableCells.length)]
  }, [opponentShots])

  useEffect(() => {
    if (gamePhase === "playing" && currentTurn === "opponent") {
      const opponentTurnTimeout = setTimeout(() => {
        const target = getAIShot()
        handleOpponentShot(`${target.x},${target.y}`)
      }, Math.random() * 1500 + 500)

      return () => clearTimeout(opponentTurnTimeout)
    }
  }, [currentTurn, gamePhase, getAIShot])

  useEffect(() => {
    if (gamePhase === "playing") {
      const playerShipCells = playerShips.flatMap((ship) => ship.positions)
      const opponentShipCells = opponentShips.flatMap((ship) => ship.positions)

      const playerHitCells = Object.entries(opponentShots)
        .filter(([_, result]) => result === "hit")
        .map(([cell]) => cell)

      const opponentHitCells = Object.entries(playerShots)
        .filter(([_, result]) => result === "hit")
        .map(([cell]) => cell)

      if (playerHitCells.length === playerShipCells.length) {
        setWinner("opponent")
        setGamePhase("ended")
        setGameEndTime(Date.now())
        setShowGameOverModal(true)
        playSound("defeat", soundVolume, soundEnabled)
      } else if (opponentHitCells.length === opponentShipCells.length) {
        setWinner("player")
        setGamePhase("ended")
        setGameEndTime(Date.now())
        setShowGameOverModal(true)
        playSound("victory", soundVolume, soundEnabled)
      }
    }
  }, [
    playerShots,
    opponentShots,
    gamePhase,
    playerShips,
    opponentShips,
    soundEnabled,
    soundVolume,
  ])

  const checkForSunkShip = useCallback(
    (shots: { [key: string]: "hit" | "miss" }, ships: Ship[]): Ship | null => {
      for (const ship of ships) {
        const allPositionsHit = ship.positions.every((pos) => {
          const cellKey = `${pos.x},${pos.y}`
          return shots[cellKey] === "hit"
        })

        if (allPositionsHit) {
          return ship
        }
      }

      return null
    },
    []
  )

  const getAvailableCells = () => {
    const cells = []
    for (let x = 0; x < 10; x++) {
      for (let y = 0; y < 10; y++) {
        const cellKey = `${x},${y}`
        if (!opponentShots[cellKey]) {
          cells.push(cellKey)
        }
      }
    }
    return cells
  }

  const handleShipPlacement = (ships: Ship[]) => {
    setPlayerShips(ships)
    playSound("place", soundVolume, soundEnabled)
  }

  const handleStartGame = () => {
    const allShipsPlaced = playerShips.every(
      (ship) => ship.positions.length > 0
    )
    if (allShipsPlaced) {
      setOpponentShips(generateRandomShips([]))
      setGamePhase("playing")
      setGameStartTime(Date.now())
      setTimer(30)
      playSound("click", soundVolume, soundEnabled)
    }
  }

  const handlePlayerShot = (x: number, y: number) => {
    if (gamePhase !== "playing" || currentTurn !== "player") return

    const cellKey = `${x},${y}`
    if (playerShots[cellKey]) return

    if (mode === "multiplayer") {
      console.log("Making shot at", x, y)
    } else {
      const isHit = opponentShips.some((ship) =>
        ship.positions.some((pos) => pos.x === x && pos.y === y)
      )

      playSound(isHit ? "hit" : "miss", soundVolume, soundEnabled)

      const newShots = {
        ...playerShots,
        [cellKey]: isHit ? "hit" : "miss",
      } as { [key: string]: "hit" | "miss" }
      setPlayerShots(newShots)

      const sunkShip = checkForSunkShip(newShots, opponentShips)
      if (sunkShip && !lastSunkShip) {
        setLastSunkShip(sunkShip)
        playSound("sunk", soundVolume, soundEnabled)
      }

      setCurrentTurn("opponent")
      setTimer(30)
    }
  }

  const handleOpponentShot = (cellKey: string) => {
    const [x, y] = cellKey.split(",").map(Number)

    const isHit = playerShips.some((ship) =>
      ship.positions.some((pos) => pos.x === x && pos.y === y)
    )

    playSound(isHit ? "hit" : "miss", soundVolume, soundEnabled)

    const newShots = {
      ...opponentShots,
      [cellKey]: isHit ? "hit" : "miss",
    } as { [key: string]: "hit" | "miss" }
    setOpponentShots(newShots)

    const sunkShip = checkForSunkShip(newShots, playerShips)
    const isSunk = !!sunkShip

    if (sunkShip) {
      playSound("sunk", soundVolume, soundEnabled)
    }

    setAiKnowledge({
      ...aiKnowledge,
      hitCells: isHit
        ? [...aiKnowledge.hitCells, { x, y }]
        : aiKnowledge.hitCells,
      missCells: !isHit
        ? [...aiKnowledge.missCells, { x, y }]
        : aiKnowledge.missCells,
      sunkShips: isSunk ? aiKnowledge.sunkShips + 1 : aiKnowledge.sunkShips,
    })

    setCurrentTurn("player")
    setTimer(30)
  }

  const handleAutoShot = () => {
    if (currentTurn === "player") {
      const availableCells = []
      for (let x = 0; x < 10; x++) {
        for (let y = 0; y < 10; y++) {
          const cellKey = `${x},${y}`
          if (!playerShots[cellKey]) {
            availableCells.push({ x, y })
          }
        }
      }

      if (availableCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * availableCells.length)
        const { x, y } = availableCells[randomIndex]
        handlePlayerShot(x, y)
      }
    }
  }

  const handleRandomize = () => {
    if (gamePhase === "setup") {
      const ships = generateRandomShips([])
      setPlayerShips(ships)
      playSound("place", soundVolume, soundEnabled)
    }
  }

  const handleRotate = () => {
    setIsRotated(!isRotated)
    playSound("rotate", soundVolume, soundEnabled)
  }

  const handleSurrender = () => {
    setWinner("opponent")
    setGamePhase("ended")
    setGameEndTime(Date.now())
    setShowGameOverModal(true)
    playSound("defeat", soundVolume, soundEnabled)
  }

  const handlePlayAgain = () => {
    setGamePhase("setup")
    setPlayerShips([])
    setOpponentShips([])
    setPlayerShots({})
    setOpponentShots({})
    setCurrentTurn("player")
    setTimer(60)
    setWinner(null)
    setAiKnowledge(mockAIKnowledge)
    setLastSunkShip(null)
    setShowGameOverModal(false)
    setGameStartTime(null)
    setGameEndTime(null)
    resetGame()
  }

  const handleDifficultyChange = (difficulty: "easy" | "medium" | "hard") => {
    setAiDifficulty(difficulty)
    playSound("click", soundVolume, soundEnabled)
  }

  const getGameDuration = (): number => {
    if (!gameStartTime) return 0
    const endTime = gameEndTime || Date.now()
    return Math.floor((endTime - gameStartTime) / 1000)
  }

  const initialSettings = {
    soundEnabled,
    musicEnabled: false,
    soundVolume,
    musicVolume: 0,
    notifications: true,
    darkMode: true,
    highContrast: false,
    autoRotate: false,
  }

  const handleSaveSettings = (settings: any) => {
    setSoundEnabled(settings.soundEnabled)
    setSoundVolume(settings.soundVolume)
  }

  return (
    <div className="min-h-screen bg-[#1A2A44] text-[#F5F7FA]">
      <div className="container mx-auto px-4 py-8">
        <GameHeader
          player={{ id: "player", username: "You", score: 0 }}
          opponent={{ id: "opponent", username: "AI", score: 0 }}
          timer={timer}
          currentTurn={currentTurn}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onOpenSettings={() => {
            setShowSettings(!showSettings)
            playSound("click", soundVolume, soundEnabled)
          }}
          gamePhase={gamePhase}
        />

        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            {gamePhase === "setup" ? (
              <GameSetup
                onShipsPlaced={handleShipPlacement}
                onRandomize={handleRandomize}
                onRotate={handleRotate}
                onStartGame={handleStartGame}
                ships={playerShips}
                isRotated={isRotated}
              />
            ) : (
              <div className="grid gap-8 md:grid-cols-2">
                <GameBoard
                  title="YOUR FLEET"
                  ships={playerShips}
                  shots={opponentShots}
                  isPlayerBoard={true}
                  onCellClick={() => {}}
                  gamePhase={gamePhase}
                  lastSunkShip={
                    currentTurn === "opponent" ? lastSunkShip : null
                  }
                />
                <GameBoard
                  title="OPPONENT"
                  ships={gamePhase === "ended" ? opponentShips : []}
                  shots={playerShots}
                  isPlayerBoard={false}
                  onCellClick={handlePlayerShot}
                  disabled={currentTurn !== "player" || gamePhase !== "playing"}
                  gamePhase={gamePhase}
                  lastSunkShip={currentTurn === "player" ? lastSunkShip : null}
                />
              </div>
            )}

            {gamePhase !== "setup" && !showGameOverModal && (
              <ActionBar
                gamePhase={gamePhase}
                onRandomize={handleRandomize}
                onSurrender={handleSurrender}
                onPlayAgain={handlePlayAgain}
                winner={winner}
              />
            )}
          </div>

          {mode === "multiplayer" ? (
            <ChatPanel gameId="game-1" username="Player" opponent="Opponent" />
          ) : showSettings ? (
            <SettingsPanel
              isVisible={true}
              initialSettings={initialSettings}
              onClose={() => setShowSettings(false)}
              onSave={handleSaveSettings}
              soundEnabled={soundEnabled}
              setSoundEnabled={setSoundEnabled}
              soundVolume={soundVolume}
              setSoundVolume={setSoundVolume}
              aiDifficulty={aiDifficulty}
              setAiDifficulty={handleDifficultyChange}
            />
          ) : (
            <div className="rounded-lg bg-[#2D3748] p-4">
              <h2 className="mb-4 font-medium">Game Stats</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#A3BFFA]">Mode:</span>
                  <span>
                    {mode === "ai"
                      ? "vs AI"
                      : mode === "ai-anonymous"
                      ? "Quick Play"
                      : "Practice"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3BFFA]">Difficulty:</span>
                  <span className="capitalize">{aiDifficulty}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3BFFA]">Your hits:</span>
                  <span>
                    {
                      Object.values(playerShots).filter(
                        (result) => result === "hit"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3BFFA]">Opponent hits:</span>
                  <span>
                    {
                      Object.values(opponentShots).filter(
                        (result) => result === "hit"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#A3BFFA]">Your shots:</span>
                  <span>{Object.keys(playerShots).length}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-[#4A4A4A]">
                  <h3 className="mb-2 font-medium text-[#4ECDC4]">
                    Your Ships
                  </h3>
                  <ul className="space-y-1">
                    {playerShips.map((ship) => {
                      const isPlaced = ship.positions.length > 0

                      const isSunk =
                        gamePhase !== "setup" &&
                        isPlaced &&
                        ship.positions.every((pos) => {
                          const cellKey = `${pos.x},${pos.y}`
                          return opponentShots[cellKey] === "hit"
                        })

                      const shipName =
                        ship.type.charAt(0).toUpperCase() + ship.type.slice(1)

                      return (
                        <li
                          key={ship.id}
                          className="flex justify-between items-center"
                        >
                          <span
                            className={
                              isSunk ? "line-through text-[#A3BFFA]" : ""
                            }
                          >
                            {shipName} ({ship.size})
                          </span>
                          {!isPlaced && gamePhase === "setup" ? (
                            <span className="text-[#A3BFFA] text-xs font-medium">
                              Not Placed
                            </span>
                          ) : isSunk ? (
                            <span className="text-[#FF6B6B] text-xs font-medium">
                              Sunk!
                            </span>
                          ) : null}
                        </li>
                      )
                    })}
                  </ul>
                </div>

                {/* Opponent Ships section */}
                <div className="mt-4 pt-4 border-t border-[#4A4A4A]">
                  <h3 className="mb-2 font-medium text-[#4ECDC4]">
                    Opponent Ships
                  </h3>
                  <ul className="space-y-1">
                    {opponentShips.map((ship) => {
                      const isSunk =
                        gamePhase !== "setup" &&
                        ship.positions.every((pos) => {
                          const cellKey = `${pos.x},${pos.y}`
                          return playerShots[cellKey] === "hit"
                        })

                      const shipName =
                        ship.type.charAt(0).toUpperCase() + ship.type.slice(1)

                      return (
                        <li
                          key={ship.id}
                          className="flex justify-between items-center"
                        >
                          <span
                            className={
                              isSunk ? "line-through text-[#A3BFFA]" : ""
                            }
                          >
                            {shipName} ({ship.size})
                          </span>
                          {isSunk && (
                            <span className="text-[#FF6B6B] text-xs font-medium">
                              Sunk!
                            </span>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showGameOverModal && (
        <GameOverModal
          isVisible={showGameOverModal}
          isVictory={winner === "player"}
          stats={{
            shotsTotal: Object.keys(playerShots).length,
            shotsHit: Object.values(playerShots).filter(
              (result) => result === "hit"
            ).length,
            shotsMissed: Object.values(playerShots).filter(
              (result) => result === "miss"
            ).length,
            shipsDestroyed: opponentShips.filter((ship) => {
              return ship.positions.every((pos) => {
                const cellKey = `${pos.x},${pos.y}`
                return playerShots[cellKey] === "hit"
              })
            }).length,
            timeElapsed: getGameDuration(),
          }}
          onPlayAgain={handlePlayAgain}
          onMainMenu={() => navigate("/")}
        />
      )}
    </div>
  )
}

export default GamePage
