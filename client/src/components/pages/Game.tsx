import React, { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import { GameBoard } from "../organisms/GameBoard"
import { Text } from "../atoms/Text"
import { Button } from "../atoms/Button"
import { useLocation, useNavigate } from "react-router-dom"
import { Navbar } from "../organisms/Navbar"
import { Game as GameType, Ship as ShipType } from "@shared-types/game"

interface Ship {
  name: string
  size: number
  isHorizontal: boolean
  placed: boolean
}

const SHIPS: Ship[] = [
  { name: "Carrier", size: 5, isHorizontal: true, placed: false },
  { name: "Battleship", size: 4, isHorizontal: true, placed: false },
  { name: "Cruiser", size: 3, isHorizontal: true, placed: false },
  { name: "Submarine", size: 3, isHorizontal: true, placed: false },
  { name: "Destroyer", size: 2, isHorizontal: true, placed: false },
]

const GamePage: React.FC = () => {
  const { socket, game, shotResult, error, setShotResult, setGame } =
    useSocket()
  const location = useLocation()
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [authError, setAuthError] = useState<string | null>(null)
  const isSinglePlayer =
    new URLSearchParams(location.search).get("mode") === "single"
  const [ships, setShips] = useState<Ship[]>(SHIPS)
  const [draggedShip, setDraggedShip] = useState<Ship | null>(null)
  const [allShipsPlaced, setAllShipsPlaced] = useState(false)

  useEffect(() => {
    if (socket) {
      socket.emit("createGame", isSinglePlayer)
    }
  }, [socket, isSinglePlayer])

  useEffect(() => {
    if (game && game.status === "playing") {
      setAllShipsPlaced(true)
    }
  }, [game])

  const handlePlaceShip = (
    shipName: string,
    coordinates: { x: number; y: number }[],
    isHorizontal: boolean
  ) => {
    if (socket && game) {
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
    if (socket && game) {
      socket.emit("fireShot", { gameId: game.id, x, y })
    }
  }

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })
      if (!response.ok) throw new Error("Registration failed")
      setShowRegister(false)
      navigate("/game")
    } catch (err) {
      setAuthError((err as Error).message)
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
      if (!response.ok) throw new Error("Login failed")
      setShowLogin(false)
      navigate("/game")
    } catch (err) {
      setAuthError((err as Error).message)
    }
  }

  const handleDragStart = (ship: Ship, e: React.DragEvent<HTMLDivElement>) => {
    setDraggedShip(ship)

    // Create a custom drag image
    const dragImage = document.createElement("div")
    dragImage.style.display = ship.isHorizontal ? "flex" : "block"
    dragImage.style.gap = "2px"

    const cellSize = 50 // Match the grid cell size
    const cellCount = ship.size
    for (let i = 0; i < cellCount; i++) {
      const cell = document.createElement("div")
      cell.style.width = `${cellSize}px`
      cell.style.height = `${cellSize}px`
      cell.style.background = "rgba(0, 247, 255, 0.5)" // Cyan with opacity
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

    // Clean up the drag image after the drag ends
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

    // Adjust coordinates if the ship would be out of bounds
    for (let i = 0; i < draggedShip.size; i++) {
      const coordX = draggedShip.isHorizontal ? adjustedX + i : adjustedX
      const coordY = draggedShip.isHorizontal ? adjustedY : adjustedY + i

      if (coordX >= 10 || coordY >= 10) {
        // Adjust position to fit within the grid
        if (draggedShip.isHorizontal) {
          adjustedX = Math.max(0, 10 - draggedShip.size)
        } else {
          adjustedY = Math.max(0, 10 - draggedShip.size)
        }
        break
      }
    }

    // Generate adjusted coordinates
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

  const player = game.player1.id === socket?.id ? game.player1 : game.player2
  const opponent = game.player1.id === socket?.id ? game.player2 : game.player1

  return (
    <div style={{ minHeight: "100vh", paddingTop: "5.5rem" }}>
      <Navbar
        onRegisterClick={() => setShowRegister(true)}
        onLoginClick={() => setShowLogin(true)}
      />
      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        <Text
          variant="h1"
          style={{ textAlign: "center", marginBottom: "1.5rem", color: "#fff" }}
        >
          Battleship
        </Text>
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

        {game.status === "setup" && !allShipsPlaced && (
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
                  Set Up Your Ships (vs AI)
                </Text>
                <GameBoard
                  grid={player?.grid || []}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              </div>
              <div
                className="glass-container"
                style={{
                  maxWidth: "300px",
                  minHeight: "500px", // Match the approximate height of the grid
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center", // Center content vertically
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
                        background:
                          "linear-gradient(to right, #00f7ff, #ff00ff)",
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
              </div>
            </div>
          </>
        )}

        {(game.status === "playing" || allShipsPlaced) && (
          <>
            <div className="game-play-container">
              <div>
                <GameBoard grid={player?.grid || []} />
              </div>
              <div>
                {opponent && (
                  <GameBoard
                    grid={opponent.grid}
                    isOpponent
                    onCellClick={
                      game.currentTurn === socket?.id
                        ? handleFireShot
                        : undefined
                    }
                  />
                )}
                <Text style={{ marginTop: "1rem", textAlign: "center" }}>
                  {game.currentTurn === socket?.id
                    ? "Your Turn"
                    : "Opponent's Turn"}
                </Text>
              </div>
            </div>
            {shotResult && (
              <div className="announcements-container">
                <div className="glass-container">
                  <Text>
                    {shotResult.shooter === socket?.id
                      ? "Your Shot"
                      : "AI Shot"}{" "}
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
                </div>
              </div>
            )}
          </>
        )}

        {game.status === "finished" && (
          <div style={{ textAlign: "center" }}>
            <Text variant="h2" style={{ marginBottom: "1rem" }}>
              Game Over! Winner:{" "}
              {game.currentTurn === socket?.id ? "You" : "Opponent"}
            </Text>
            <Button onClick={() => navigate("/")} variant="primary">
              Back to Home
            </Button>
          </div>
        )}
      </div>

      {/* Register/Login Modals */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Text variant="h2" style={{ marginBottom: "1rem" }}>
              Register
            </Text>
            {authError && (
              <Text style={{ color: "#ff4444", marginBottom: "0.5rem" }}>
                {authError}
              </Text>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <input
                type="text"
                placeholder="First Name"
                value={registerData.firstname}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    firstname: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={registerData.lastname}
                onChange={(e) =>
                  setRegisterData({ ...registerData, lastname: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button onClick={handleRegister}>Submit</Button>
                <Button onClick={() => setShowRegister(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Text variant="h2" style={{ marginBottom: "1rem" }}>
              Login
            </Text>
            {authError && (
              <Text style={{ color: "#ff4444", marginBottom: "0.5rem" }}>
                {authError}
              </Text>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button onClick={handleLogin}>Submit</Button>
                <Button onClick={() => setShowLogin(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GamePage
