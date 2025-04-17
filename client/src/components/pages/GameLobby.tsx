import React, { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import { Text, Button, CenteredTitle } from "../atoms"
import { PageLayout } from "../organisms"
import { GlassContainer } from "../molecules"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

interface GameInfo {
  id: string
  joinCode: string | null
  playerCount: number
  playerNames: string[]
}

const GameLobby: React.FC = () => {
  const { socket } = useSocket()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [gameList, setGameList] = useState<GameInfo[]>([])
  const [error, setError] = useState<string | null>(null)
  const [joinCode, setJoinCode] = useState<string>("")

  useEffect(() => {
    if (socket) {
      socket.emit("getGameList")

      socket.on("gameListUpdate", (games: GameInfo[]) => {
        console.log("Received gameListUpdate:", games)
        setGameList(games)
      })

      socket.on("error", (err: string) => {
        console.error("Server error:", err)
        setError(err)
      })

      return () => {
        socket.off("gameListUpdate")
        socket.off("error")
      }
    }
  }, [socket])

  const handleCreateGame = () => {
    if (socket && user) {
      socket.emit("createGame", false, user.id)
      navigate("/game?mode=multiplayer")
    } else {
      navigate("/game?mode=single")
    }
  }

  const handleJoinGame = (gameId: string) => {
    if (socket && user) {
      socket.emit("joinGame", gameId, user.id)
      navigate(`/game?mode=multiplayer&gameId=${gameId}`)
    }
  }

  const handleJoinByCode = () => {
    if (socket && user && joinCode) {
      socket.emit("joinGameByCode", joinCode, user.id)
      navigate(`/game?mode=multiplayer&joinCode=${joinCode}`)
    }
  }

  const handleSpectateGame = (gameId: string) => {
    if (socket) {
      socket.emit("spectateGame", gameId)
      navigate(`/game?mode=spectator&gameId=${gameId}`)
    }
  }

  return (
    <PageLayout>
      <CenteredTitle>Game Lobby</CenteredTitle>
      {error && (
        <Text
          style={{
            textAlign: "center",
            color: "#ff4444",
            marginBottom: "1rem",
          }}
        >
          {error}
        </Text>
      )}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Button onClick={handleCreateGame} variant="primary">
          Create 1v1 Game
        </Button>
        <Button
          onClick={() => navigate("/game?mode=single")}
          variant="secondary"
        >
          Play vs AI
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <input
          type="text"
          placeholder="Enter 6-digit join code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <Button onClick={handleJoinByCode} variant="primary">
          Join by Code
        </Button>
      </div>
      <GlassContainer>
        <Text
          variant="h2"
          style={{ textAlign: "center", marginBottom: "1rem" }}
        >
          Available Games
        </Text>
        {gameList.length > 0 ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            {gameList.map((game) => (
              <GlassContainer
                key={game.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                }}
              >
                <Text>Game ID: {game.id}</Text>
                {game.joinCode && <Text>Join Code: {game.joinCode}</Text>}
                <Text>Players: {game.playerCount} / 2</Text>
                <Text>
                  Player Names:{" "}
                  {game.playerNames
                    ?.filter((name): name is string => typeof name === "string")
                    .join(", ") || "None"}
                </Text>
                <div
                  style={{
                    display: "flex",
                    gap: "0.5rem",
                    marginTop: "0.5rem",
                  }}
                >
                  <Button
                    onClick={() => handleJoinGame(game.id)}
                    variant="primary"
                    disabled={game.playerCount >= 2}
                  >
                    Join
                  </Button>
                  <Button
                    onClick={() => handleSpectateGame(game.id)}
                    variant="secondary"
                  >
                    Spectate
                  </Button>
                </div>
              </GlassContainer>
            ))}
          </div>
        ) : (
          <Text style={{ textAlign: "center" }}>
            No games available. Create a new game to start playing!
          </Text>
        )}
      </GlassContainer>
    </PageLayout>
  )
}

export default GameLobby
