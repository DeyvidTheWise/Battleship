import { useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"
import { Game as GameType } from "@shared-types/game"
import { useAuth } from "../context/AuthContext"

export const useSocket = () => {
  const { token } = useAuth()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [game, setGame] = useState<GameType | null>(null)
  const [shotResult, setShotResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("Initializing socket with token:", token)
    const newSocket = io("http://localhost:5000", {
      auth: { token },
    })
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
    })

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message)
    })

    newSocket.on("gameCreated", (game: GameType) => {
      console.log("gameCreated event received:", game)
      setGame(game)
    })

    newSocket.on("gameUpdated", (game: GameType) => {
      console.log("gameUpdated event received:", game)
      setGame(game)
    })

    newSocket.on("shotResult", (result: any) => {
      console.log("shotResult event received:", result)
      setShotResult(result)
    })

    newSocket.on("error", (err: string) => {
      console.error("Socket error:", err)
      setError(err)
    })

    return () => {
      console.log("Disconnecting socket")
      newSocket.disconnect()
    }
  }, [token])

  return { socket, game, shotResult, error, setGame, setShotResult, setError }
}
