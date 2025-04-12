import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Game } from "../types/game"

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [game, setGame] = useState<Game | null>(null)
  const [shotResult, setShotResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)

    newSocket.on("gameCreated", (game: Game) => setGame(game))
    newSocket.on("gameUpdated", (game: Game) => setGame(game))
    newSocket.on("shotResult", (result: any) => setShotResult(result))
    newSocket.on("error", (err: string) => setError(err))

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return { socket, game, shotResult, error, setGame, setShotResult, setError }
}
