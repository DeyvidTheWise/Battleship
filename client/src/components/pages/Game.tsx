import React, { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import { GameBoard, PageLayout } from "../organisms"
import { Chat, GlassContainer } from "../molecules"
import { Text, Button, CenteredTitle } from "../atoms"
import { useLocation, useNavigate } from "react-router-dom"
import {
  Game as GameType,
  Ship as ShipType,
  Coordinate,
} from "@shared-types/game"
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
  const {
    socket,
    game,
    shotResult,
    error,
    setShotResult,
    setGame,
    isConnected,
  } = useSocket()
  const { user, token } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const isSinglePlayer = searchParams.get("mode") === "single"
  const isMultiplayer = searchParams.get("mode") === "multiplayer"
  const isSpectator = searchParams.get("mode") === "spectator"
  const gameId = searchParams.get("gameId")
  const joinCode = searchParams.get("joinCode")
  const [ships, setShips] = useState<ShipType[]>(SHIPS)
  const [draggedShip, setDraggedShip] = useState<ShipType | null>(null)
  const [allShipsPlaced, setAllShipsPlaced] = useState(false)
  const [timer, setTimer] = useState<number>(30)
  const [timerActive, setTimerActive] = useState<boolean>(false)
  const [placementError, setPlacementError] = useState<string | null>(null)

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
    setPlacementError(null)
  }, [location, setGame, setShotResult])

  // Handle socket events and game initialization
  useEffect(() => {
    if (socket && isConnected) {
      const playerId = user ? user.id : "anonymous"
      console.log("Socket connected, emitting createGame:", {
        playerId,
        isSinglePlayer,
        isMultiplayer,
        isSpectator,
        gameId,
        joinCode,
      })
      if (isSpectator && gameId) {
        socket.emit("spectateGame", gameId)
      } else if (isMultiplayer && gameId) {
        if (!user) {
          navigate("/lobby")
          return
        }
        socket.emit("joinGame", gameId, user.id)
      } else if (isMultiplayer && joinCode) {
        if (!user) {
          navigate("/lobby")
          return
        }
        socket.emit("joinGameByCode", joinCode, user.id)
      } else if (isSinglePlayer) {
        socket.emit("createGame", true, playerId)
      } else if (isMultiplayer) {
        // If no gameId or joinCode, create a new multiplayer game
        socket.emit("createGame", false, playerId)
      }
    } else {
      console.error("Socket not connected or not ready:", {
        socket: !!socket,
        isConnected,
      })
    }
  }, [
    socket,
    isConnected,
    user,
    isSinglePlayer,
    isMultiplayer,
    isSpectator,
    gameId,
    joinCode,
    navigate,
  ])

  // Listen for server errors
  useEffect(() => {
    if (socket) {
      const errorHandler = (err: string) => {
        console.error("Server error:", err)
        if (
          err.includes("Invalid ship placement") ||
          err.includes("Not your turn")
        ) {
          setPlacementError(
            err.includes("Invalid ship placement")
              ? "Cannot place ship here. Please try a different position."
              : "Not your turn. Please wait for your opponent."
          )
        } else {
          setPlacementError(err)
        }
      }

      socket.on("error", errorHandler)

      return () => {
        socket.off("error", errorHandler)
      }
    }
  }, [socket])

  // Log game state changes
  useEffect(() => {
    if (game) {
      console.log("Game state updated:", game)
      setPlacementError(null)
      const player =
        game.player1?.id === (user?.id || "anonymous")
          ? game.player1
          : game.player2
      if (player) {
        console.log(
          "Client grid state after update:",
          player.grid.map((row) => row.join(","))
        )
      }
    } else {
      console.log("Game state is null")
    }
  }, [game, user])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (timerActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer <= 1) {
            setTimerActive(false)
            if (game && socket && !isSpectator) {
              socket.emit("timeout", game.id, user?.id || "anonymous")
            }
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [timerActive, timer, game, socket, user])

  const handleDragStart = (
    ship: ShipType,
    event: React.DragEvent<HTMLDivElement>
  ) => {
    setDraggedShip(ship)
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (x: number, y: number) => {
    if (!draggedShip || draggedShip.placed) return

    const GRID_SIZE = 10
    const coordinates: { x: number; y: number }[] = []

    let adjustedX = x
    let adjustedY = y

    if (draggedShip.isHorizontal) {
      adjustedX = Math.max(0, Math.min(GRID_SIZE - draggedShip.size, x))
    } else {
      adjustedY = Math.max(0, Math.min(GRID_SIZE - draggedShip.size, y))
    }

    for (let i = 0; i < draggedShip.size; i++) {
      const coordX = draggedShip.isHorizontal ? adjustedX + i : adjustedX
      const coordY = draggedShip.isHorizontal ? adjustedY : adjustedY + i
      coordinates.push({ x: coordX, y: coordY })
    }

    console.log(
      "Client calculated coordinates:",
      coordinates,
      "for ship:",
      draggedShip.name
    )

    const player =
      game?.player1?.id === (user?.id || "anonymous")
        ? game.player1
        : game?.player2
    if (!player || !game) {
      console.log(
        "Cannot validate placement: Player or game state not available"
      )
      setPlacementError("Game state not ready. Please try again.")
      return
    }

    console.log(
      "Client grid state before validation:",
      player.grid.map((row) => row.join(","))
    )

    const isValid = coordinates.every(
      ({ x, y }) =>
        x >= 0 &&
        x < GRID_SIZE &&
        y >= 0 &&
        y < GRID_SIZE &&
        player.grid[y][x] === "empty"
    )
    if (!isValid) {
      console.log("Client validation failed:", {
        coordinates,
        grid: player.grid,
      })
      setPlacementError(
        "Cannot place ship here. Please try a different position."
      )
      return
    }

    handlePlaceShip(draggedShip.name, coordinates, draggedShip.isHorizontal)
    setDraggedShip(null)
  }

  const handlePlaceShip = (
    shipName: string,
    coordinates: { x: number; y: number }[],
    isHorizontal: boolean
  ) => {
    if (socket && game && !isSpectator) {
      console.log("Sending placeShip to server:", {
        shipName,
        coordinates,
        isHorizontal,
      })
      setPlacementError(null)
      socket.emit("placeShip", {
        gameId: game.id,
        shipName,
        coordinates,
        isHorizontal,
      })
      socket.once("gameUpdated", (updatedGame: GameType) => {
        console.log("Received gameUpdated after placeShip:", updatedGame)
        const player =
          updatedGame.player1?.id === (user?.id || "anonymous")
            ? updatedGame.player1
            : updatedGame.player2
        if (
          player &&
          player.ships.some(
            (ship: ShipType) =>
              ship.name === shipName && ship.coordinates.length > 0
          )
        ) {
          console.log("Ship placed successfully on client:", {
            shipName,
            coordinates,
          })
          setShips((prevShips) =>
            prevShips.map((ship) =>
              ship.name === shipName ? { ...ship, placed: true } : ship
            )
          )
          if (ships.every((ship) => ship.name === shipName || ship.placed)) {
            setAllShipsPlaced(true)
            setTimerActive(true)
          }
        }
      })
    }
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

  const handleFireShot = (x: number, y: number) => {
    if (
      socket &&
      game &&
      !isSpectator &&
      game.status === "playing" &&
      game.currentTurn === (user?.id || "anonymous")
    ) {
      socket.emit("fireShot", { gameId: game.id, x, y })
      setTimerActive(true)
      setTimer(30)
    }
  }

  if (
    error &&
    !error.includes("Invalid ship placement") &&
    !error.includes("Not your turn")
  ) {
    return (
      <PageLayout>
        <CenteredTitle>Error</CenteredTitle>
        <Text
          style={{
            textAlign: "center",
            color: "#ff4444",
            marginBottom: "1rem",
          }}
        >
          {error}
        </Text>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <Button onClick={() => navigate("/lobby")} variant="primary">
            Back to Lobby
          </Button>
          <Button
            onClick={() => {
              setGame(null)
              setPlacementError(null)
              setShips(SHIPS)
              setAllShipsPlaced(false)
              navigate(location.pathname + location.search)
            }}
            variant="secondary"
          >
            Retry Game
          </Button>
        </div>
      </PageLayout>
    )
  }

  if (!game) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100vw",
          background: "linear-gradient(to bottom, #1e3c72, #2a5298)",
          backgroundSize: "cover",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            marginTop: "5rem",
            color: "#fff",
            fontSize: "2rem",
          }}
        >
          Loading...
        </Text>
      </div>
    )
  }

  const player =
    game.player1?.id === (user?.id || "anonymous") ? game.player1 : game.player2
  const opponent =
    game.player1?.id === (user?.id || "anonymous") ? game.player2 : game.player1

  // Check if waiting for second player in multiplayer mode
  if (isMultiplayer && !game.player2 && !isSpectator) {
    const shareableLink = `${window.location.origin}/game?mode=multiplayer&gameId=${game.id}`
    return (
      <PageLayout>
        <CenteredTitle>Waiting for Second Player</CenteredTitle>
        <Text
          style={{ textAlign: "center", marginBottom: "1rem", color: "#fff" }}
        >
          Share this link for faster joining:{" "}
          <a href={shareableLink} style={{ color: "#00f7ff" }}>
            {shareableLink}
          </a>
        </Text>
        <Text
          style={{ textAlign: "center", marginBottom: "1rem", color: "#fff" }}
        >
          Or share this code if the player is already on the platform:{" "}
          <strong>{game.joinCode}</strong>
        </Text>
        <Button
          onClick={() => navigate("/lobby")}
          variant="primary"
          style={{ display: "block", margin: "0 auto" }}
        >
          Back to Lobby
        </Button>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <CenteredTitle>Battleship</CenteredTitle>
      {placementError && (
        <Text
          style={{
            textAlign: "center",
            marginBottom: "1rem",
            color: "#ff4444",
          }}
        >
          {placementError}
        </Text>
      )}
      {game.status === "setup" && !allShipsPlaced && !isSpectator && (
        <>
          <Text style={{ textAlign: "center", marginBottom: "1rem" }}>
            You have one unit of each marine vessel: Carrier (5), Battleship
            (4), Cruiser (3), Submarine (3), Destroyer (2). Drag and drop to
            place them on the grid.
          </Text>
          {isMultiplayer && game.joinCode && (
            <Text
              style={{
                textAlign: "center",
                marginBottom: "1rem",
                color: "#fff",
              }}
            >
              Share this join code with your friend:{" "}
              <strong>{game.joinCode}</strong>
            </Text>
          )}
          <div className="game-setup-container">
            <div>
              <Text
                variant="h2"
                style={{ textAlign: "center", marginBottom: "1rem" }}
              >
                Set Up Your Ships {isSinglePlayer ? "(vs AI)" : "(vs Player)"}
              </Text>
              <GameBoard
                grid={
                  player?.grid ||
                  Array(10)
                    .fill(null)
                    .map(() => Array(10).fill("empty"))
                }
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
              flexWrap: "wrap",
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
              <GameBoard
                grid={
                  player?.grid ||
                  Array(10)
                    .fill(null)
                    .map(() => Array(10).fill("empty"))
                }
              />
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
                  opponent?.grid ||
                  Array(10)
                    .fill(null)
                    .map(() => Array(10).fill("empty"))
                }
                isOpponent
                onCellClick={handleFireShot}
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
                      game.currentTurn === game.player1?.id
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
                        shotResult.shooter === game.player1?.id
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
              ? game.winner === game.player1?.id
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
