import React, { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import { GameBoard } from "../organisms/GameBoard"
import { ShipSelector } from "../molecules/ShipSelector"
import { Text } from "../atoms/Text"
import { Button } from "../atoms/Button"
import { useLocation, useNavigate } from "react-router-dom"
import { Navbar } from "../organisms/Navbar"

const SHIPS = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
]

const Game: React.FC = () => {
  const { socket, game, shotResult, error, setShotResult } = useSocket()
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

  useEffect(() => {
    if (socket) {
      socket.emit("createGame", isSinglePlayer)
    }
  }, [socket, isSinglePlayer])

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

  if (!game)
    return (
      <Text style={{ textAlign: "center", marginTop: "5rem" }}>Loading...</Text>
    )

  const player = game.player1.id === socket?.id ? game.player1 : game.player2
  const opponent = game.player1.id === socket?.id ? game.player2 : game.player1

  return (
    <div style={{ minHeight: "100vh", paddingTop: "5rem", padding: "1.5rem" }}>
      <Navbar
        onRegisterClick={() => setShowRegister(true)}
        onLoginClick={() => setShowLogin(true)}
      />
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
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

        {game.status === "setup" && (
          <>
            <Text
              variant="h2"
              style={{ textAlign: "center", marginBottom: "1rem" }}
            >
              {isSinglePlayer
                ? "Set Up Your Ships (vs AI)"
                : "Set Up Your Ships (Multiplayer)"}
            </Text>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "1.5rem",
              }}
            >
              <ShipSelector ships={SHIPS} onPlaceShip={handlePlaceShip} />
            </div>
            <GameBoard grid={player?.grid || []} />
          </>
        )}

        {game.status === "playing" && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
            }}
          >
            <div>
              <GameBoard grid={player?.grid || []} />
            </div>
            <div>
              {opponent && (
                <GameBoard
                  grid={opponent.grid}
                  isOpponent
                  onCellClick={
                    game.currentTurn === socket?.id ? handleFireShot : undefined
                  }
                />
              )}
              <Text style={{ marginTop: "1rem", textAlign: "center" }}>
                {game.currentTurn === socket?.id
                  ? "Your Turn"
                  : "Opponent's Turn"}
              </Text>
              {shotResult && (
                <div className="glass-container" style={{ marginTop: "1rem" }}>
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
              )}
            </div>
          </div>
        )}

        {game.status === "finished" && (
          <div style={{ textAlign: "center" }}>
            <Text variant="h2" style={{ marginBottom: "1rem" }}>
              Game Over! Winner:{" "}
              {game.currentTurn === socket?.id ? "Opponent" : "You"}
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

export default Game
