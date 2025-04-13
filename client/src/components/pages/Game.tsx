// client/src/components/pages/GamePage.tsx
import React, { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import GameBoard from "../organisms/GameBoard"
import { Chat } from "../molecules/Chat"
import { Text } from "../atoms/Text"
import Button from "../atoms/Button"
import { useLocation, useNavigate } from "react-router-dom"
import PageLayout from "../organisms/PageLayout"
import CenteredTitle from "../atoms/CenteredTitle"
import GlassContainer from "../molecules/GlassContainer"
import { Game as GameType, Ship as ShipType } from "@shared-types/game"
import { useAuth } from "../../context/AuthContext"

const SHIPS: ShipType[] = [
  {
    name: "Carrier",
    size: 5,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Battleship",
    size: 4,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Cruiser",
    size: 3,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Submarine",
    size: 3,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Destroyer",
    size: 2,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
]

const GamePage: React.FC = () => {
  const { socket, game, shotResult, error, setShotResult, setGame } =
    useSocket()
  const { user, token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const isSinglePlayer = searchParams.get("mode") === "single"
  const isMultiplayer = searchParams.get("mode") === "multiplayer"
  const isSpectator = searchParams.get("mode") === "spectator"
  const gameId = searchParams.get("gameId")
  const [ships, setShips] = useState<ShipType[]>(SHIPS)
  const [draggedShip, setDraggedShip] = useState<ShipType | null>(null)
  const [allShipsPlaced, setAllShipsPlaced] = useState(false)
  const [timer, setTimer] = useState<number>(30)
  const [timerActive, setTimerActive] = useState<boolean>(false)

  console.log("GamePage user state:", user, "token:", token)

  // Reset game state when navigating to a new game
  useEffect(() => {
    setGame(null)
    setShotResult(null)
    setShips(SHIPS)
    setDraggedShip(null)
    setAllShipsPlaced(false)
    setTimer(30)
    setTimerActive(false)
  }, [location, setGame, setShotResult])

  // Handle socket events and game initialization
  useEffect(() => {
    if (socket) {
      const playerId = user ? user.id : "anonymous"
      console.log("Socket connected, emitting createGame:", {
        playerId,
        isSinglePlayer,
        isMultiplayer,
        isSpectator,
        gameId,
      })
      if (isSpectator && gameId) {
        socket.emit("spectateGame", gameId)
      } else if (isMultiplayer && gameId) {
        if (!user) {
          navigate("/lobby")
          return
        }
        socket.emit("joinGame", gameId, user.id)
      } else if (isSinglePlayer) {
        socket.emit("createGame", true, playerId)
      }
    } else {
      console.error("Socket not connected")
    }
  }, [
    socket,
    user,
    isSinglePlayer,
    isMultiplayer,
    isSpectator,
    gameId,
    navigate,
  ])

  useEffect(() => {
    if (game && game.status === "playing") {
      setAllShipsPlaced(true)
    }
  }, [game])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (
      game &&
      game.status === "playing" &&
      game.currentTurn === (user?.id || "anonymous") &&
      !isSpectator
    ) {
      setTimerActive(true)
      setTimer(30)

      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval!)
            handleAutoFireShot()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setTimerActive(false)
      setTimer(30)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [game, user])

  // Auto-clear shotResult after 3 seconds
  useEffect(() => {
    if (shotResult) {
      const timeout = setTimeout(() => {
        setShotResult(null)
      }, 3000)

      return () => clearTimeout(timeout)
    }
  }, [shotResult, setShotResult])

  // Handle game end: Update XP and history for logged-in users
  useEffect(() => {
    if (game && game.status === "finished" && user && socket) {
      socket.emit("gameFinished", {
        gameId: game.id,
        winner: game.winner,
        userId: user.id,
      })
    }
  }, [game, user, socket])

  const handleAutoFireShot = () => {
    if (!game || !opponent) return

    const opponentGrid = opponent.grid
    const untargetedCells: { x: number; y: number }[] = []

    for (let y = 0; y < opponentGrid.length; y++) {
      for (let x = 0; x < opponentGrid[y].length; x++) {
        if (opponentGrid[y][x] !== "hit" && opponentGrid[y][x] !== "miss") {
          untargetedCells.push({ x, y })
        }
      }
    }

    if (untargetedCells.length > 0) {
      const randomCell =
        untargetedCells[Math.floor(Math.random() * untargetedCells.length)]
      handleFireShot(randomCell.x, randomCell.y)
    }
  }

  const handlePlaceShip = (
    shipName: string,
    coordinates: { x: number; y: number }[],
    isHorizontal: boolean
  ) => {
    if (socket && game && !isSpectator) {
      socket.emit("placeShip", {
        gameId: game.id,
        shipName,
        coordinates,
        isHorizontal,
      })
      setShips((prevShips) =>
        prevShips.map((ship) =>
          ship.name === shipName ? { ...ship, placed: true } : ship
        )
      )
      if (ships.every((ship) => ship.name === shipName || ship.placed)) {
        setAllShipsPlaced(true)
      }
    }
  }

  const handleFireShot = (x: number, y: number) => {
    if (socket && game && !isSpectator) {
      console.log("Firing shot:", {
        gameId: game.id,
        x,
        y,
        playerId: user?.id || "anonymous",
      })
      socket.emit("fireShot", { gameId: game.id, x, y })
      setTimerActive(false)
    } else {
      console.error("Cannot fire shot:", {
        socket: !!socket,
        game: !!game,
        isSpectator,
      })
    }
  }

  const handleDragStart = (
    ship: ShipType,
    e: React.DragEvent<HTMLDivElement>
  ) => {
    setDraggedShip(ship)

    const dragImage = document.createElement("div")
    dragImage.style.display = ship.isHorizontal ? "flex" : "block"
    dragImage.style.gap = "2px"

    const cellSize = 50
    const cellCount = ship.size
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("div")
      cell.style.width = `${cellSize}px`
      cell.style.height = `${cellSize}px`
      cell.style.background = "rgba(0, 247, 255, 0.5)"
      cell.style.border = "1px solid #555"
      if (ship.isHorizontal) {
        cell.style.display = "inline-block"
      } else {
        cell.style.display = "block"
      }
      dragImage.appendChild(cell)
    }

    document.body.appendChild(dragImage)
    e.dataTransfer.setDragImage(dragImage, 0, 0)

    setTimeout(() => {
      document.body.removeChild(dragImage)
    }, 0)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  const handleDrop = (x: number, y: number) => {
    if (!draggedShip || draggedShip.placed) return

    const coordinates: { x: number; y: number }[] = []
    let adjustedX = x
    let adjustedY = y

    for (let i = 0; i < draggedShip.size; i++) {
      const coordX = draggedShip.isHorizontal ? adjustedX + i : adjustedX
      const coordY = draggedShip.isHorizontal ? adjustedY : adjustedY + i

      if (coordX >= 10 || coordY >= 10) {
        if (draggedShip.isHorizontal) {
          adjustedX = Math.max(0, 10 - draggedShip.size)
        } else {
          adjustedY = Math.max(0, 10 - draggedShip.size)
        }
        break
      }
    }

    for (let i = 0; i < draggedShip.size; i++) {
      const coordX = draggedShip.isHorizontal ? adjustedX + i : adjustedX
      const coordY = draggedShip.isHorizontal ? adjustedY : adjustedY + i
      coordinates.push({ x: coordX, y: coordY })
    }

    handlePlaceShip(draggedShip.name, coordinates, draggedShip.isHorizontal)
    setDraggedShip(null)
  }

  const toggleOrientation = (shipName: string) => {
    setShips((prevShips) =>
      prevShips.map((ship) =>
        ship.name === shipName
          ? { ...ship, isHorizontal: !ship.isHorizontal }
          : ship
      )
    )
  }

  if (!game)
    return (
      <Text style={{ textAlign: "center", marginTop: "5rem" }}>Loading...</Text>
    )

  const player =
    game.player1.id === (user?.id || "anonymous") ? game.player1 : game.player2
  const opponent =
    game.player1.id === (user?.id || "anonymous") ? game.player2 : game.player1

  return (
    <PageLayout>
      <CenteredTitle>Battleship</CenteredTitle>
      {error && (
        <Text
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "#ff4444",
          }}
        >
          {error}
        </Text>
      )}

      {game.status === "setup" && !allShipsPlaced && !isSpectator && (
        <>
          <Text style={{ textAlign: "center", marginBottom: "1rem" }}>
            You have one unit of each marine vessel: Carrier (5), Battleship
            (4), Cruiser (3), Submarine (3), Destroyer (2). Drag and drop to
            place them on the grid.
          </Text>
          <div className="game-setup-container">
            <div>
              <Text
                variant="h2"
                style={{ textAlign: "center", marginBottom: "1rem" }}
              >
                Set Up Your Ships {isSinglePlayer ? "(vs AI)" : "(vs Player)"}
              </Text>
              <GameBoard
                grid={player?.grid || []}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              />
            </div>
            <GlassContainer
              style={{
                maxWidth: "300px",
                minHeight: "500px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Text variant="h2" style={{ marginBottom: "1rem" }}>
                Place Your Ships
              </Text>
              {ships.map((ship) => (
                <div
                  key={ship.name}
                  draggable={!ship.placed}
                  onDragStart={(e) => handleDragStart(ship, e)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.5rem",
                    opacity: ship.placed ? 0.5 : 1,
                    cursor: ship.placed ? "not-allowed" : "grab",
                  }}
                >
                  <div
                    style={{
                      background: "linear-gradient(to right, #00f7ff, #ff00ff)",
                      padding: "0.5rem 1rem",
                      borderRadius: "5px",
                      flex: 1,
                      textAlign: "center",
                      fontWeight: "bold",
                      color: "#fff",
                    }}
                  >
                    {ship.name} ({ship.size})
                  </div>
                  <Button
                    onClick={() => toggleOrientation(ship.name)}
                    variant="secondary"
                    disabled={ship.placed}
                  >
                    {ship.isHorizontal ? "Horizontal" : "Vertical"}
                  </Button>
                </div>
              ))}
            </GlassContainer>
          </div>
        </>
      )}

      {(game.status === "playing" || allShipsPlaced) && (
        <>
          <div
            className="game-play-container"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              gap: "2rem",
              marginBottom: "2rem",
              flexWrap: "wrap", // Ensure responsiveness
            }}
          >
            <div>
              <Text
                variant="h2"
                style={{
                  textAlign: "center",
                  marginBottom: "1rem",
                  color: "#fff",
                }}
              >
                Your Board
              </Text>
              <GameBoard grid={game.player1.grid} />
            </div>
            <div>
              <Text
                variant="h2"
                style={{
                  textAlign: "center",
                  marginBottom: "1rem",
                  color: "#fff",
                }}
              >
                Opponent's Board
              </Text>
              <GameBoard
                grid={
                  game.player2?.grid ||
                  Array(10)
                    .fill(null)
                    .map(() => Array(10).fill("empty"))
                }
                isOpponent
                onCellClick={handleFireShot} // Pass the click handler
              />
              <Text
                style={{
                  marginTop: "1rem",
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                {isSpectator
                  ? `Current Turn: ${
                      game.currentTurn === game.player1.id
                        ? "Player 1"
                        : "Player 2"
                    }`
                  : game.currentTurn === (user?.id || "anonymous")
                  ? "Your Turn"
                  : "Opponent's Turn"}
                {game.currentTurn === (user?.id || "anonymous") &&
                  timerActive &&
                  !isSpectator &&
                  ` (Time left: ${timer}s)`}
              </Text>
            </div>
          </div>
          {shotResult && (
            <div className="announcements-container">
              <GlassContainer>
                <Text>
                  {isSpectator
                    ? `Shot by ${
                        shotResult.shooter === game.player1.id
                          ? "Player 1"
                          : "Player 2"
                      }`
                    : shotResult.shooter === (user?.id || "anonymous")
                    ? "Your Shot"
                    : "Opponent Shot"}{" "}
                  at ({String.fromCharCode(65 + shotResult.x)},{" "}
                  {shotResult.y + 1}): {shotResult.hit ? "Hit!" : "Miss!"}
                  {shotResult.sunk && " Ship Sunk!"}
                  {shotResult.gameOver && " Game Over!"}
                </Text>
                <Button
                  onClick={() => setShotResult(null)}
                  variant="secondary"
                  style={{ marginTop: "0.5rem" }}
                >
                  Clear
                </Button>
              </GlassContainer>
            </div>
          )}
          {(isMultiplayer || isSpectator) && gameId && <Chat gameId={gameId} />}
        </>
      )}

      {game.status === "finished" && (
        <div style={{ textAlign: "center" }}>
          <Text variant="h2" style={{ marginBottom: "1rem" }}>
            Game Over! Winner:{" "}
            {isSpectator
              ? game.winner === game.player1.id
                ? "Player 1"
                : "Player 2"
              : game.winner === (user?.id || "anonymous")
              ? "You"
              : "Opponent"}
          </Text>
          <Button onClick={() => navigate("/lobby")} variant="primary">
            Back to Lobby
          </Button>
        </div>
      )}
    </PageLayout>
  )
}

export default GamePage
