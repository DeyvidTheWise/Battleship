import React, { useEffect, useState } from "react"
import { useSocket } from "../../hooks/useSocket"
import { Text } from "../atoms/Text"
import Button from "../atoms/Button"
import { useNavigate } from "react-router-dom"
import PageLayout from "../organisms/PageLayout"
import { useAuth } from "../../context/AuthContext"
import CenteredTitle from "../atoms/CenteredTitle"

const GameLobby: React.FC = () => {
  const { socket } = useSocket()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [gameList, setGameList] = useState<string[]>([])

  useEffect(() => {
    if (socket) {
      socket.emit("getGameList")

      socket.on("gameListUpdate", (games: string[]) => {
        setGameList(games)
      })

      return () => {
        socket.off("gameListUpdate")
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

  const handleSpectateGame = (gameId: string) => {
    if (socket) {
      socket.emit("spectateGame", gameId)
      navigate(`/game?mode=spectator&gameId=${gameId}`)
    }
  }

  return (
    <PageLayout>
      <CenteredTitle>Game Lobby</CenteredTitle>
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
      <div className="glass-container">
        <Text
          variant="h2"
          style={{ textAlign: "center", marginBottom: "1rem" }}
        >
          Available Games
        </Text>
        {gameList.length > 0 ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            {gameList.map((gameId) => (
              <div
                key={gameId}
                className="glass-container"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "1rem",
                }}
              >
                <Text>Game ID: {gameId}</Text>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <Button
                    onClick={() => handleJoinGame(gameId)}
                    variant="primary"
                  >
                    Join
                  </Button>
                  <Button
                    onClick={() => handleSpectateGame(gameId)}
                    variant="secondary"
                  >
                    Spectate
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Text style={{ textAlign: "center" }}>
            No games available. Create a new game to start playing!
          </Text>
        )}
      </div>
    </PageLayout>
  )
}

export default GameLobby
