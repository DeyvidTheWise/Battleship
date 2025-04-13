import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Game as GameType } from "@shared-types/game"

export const useSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [game, setGame] = useState<GameType | null>(null)
  const [shotResult, setShotResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const newSocket = io("http://localhost:5000")
    setSocket(newSocket)

    newSocket.on("gameCreated", (game: GameType) => setGame(game))
    newSocket.on("gameUpdated", (game: GameType) => {
      console.log("Game updated:", game)
      setGame(game)
    })
    newSocket.on("shotResult", (result: any) => {
      console.log("Shot result:", result)
      setShotResult(result)
    })
    newSocket.on("error", (err: string) => setError(err))

    return () => {
      newSocket.disconnect()
    }
  }, [])

  return { socket, game, shotResult, error, setGame, setShotResult, setError }
}
