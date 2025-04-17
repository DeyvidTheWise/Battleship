import { useEffect, useState, Dispatch, SetStateAction } from "react"
import { io, Socket } from "socket.io-client"
import { Game as GameType } from "@shared-types/game"
import { useAuth } from "../context/AuthContext"

interface UseSocketReturn {
  socket: Socket | null
  game: GameType | null
  shotResult: any
  error: string | null
  setGame: Dispatch<SetStateAction<GameType | null>>
  setShotResult: Dispatch<SetStateAction<any>>
  setError: Dispatch<SetStateAction<string | null>>
  isConnected: boolean
}

export const useSocket = (): UseSocketReturn => {
  const { token, user } = useAuth() // Destructure user from useAuth
  const [socket, setSocket] = useState<Socket | null>(null)
  const [game, setGame] = useState<GameType | null>(null)
  const [shotResult, setShotResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    console.log("Initializing socket with token:", token)
    if (!token) {
      console.warn("No token provided for socket connection")
    }
    const newSocket = io("http://localhost:5000", {
      auth: { token },
    })
    setSocket(newSocket)

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id)
      setIsConnected(true)
    })

    newSocket.on("connect_error", (err) => {
      console.error("Socket connection error:", err.message)
      setError(err.message)
      setIsConnected(false)
    })

    newSocket.on("gameCreated", (game: GameType) => {
      console.log("gameCreated event received:", game)
      setGame(game)
    })

    newSocket.on("gameUpdated", (game: GameType) => {
      console.log("gameUpdated event received:", game)
      const player = game.player1?.id === user?.id ? game.player1 : game.player2
      if (player) {
        console.log(
          "Player grid after gameUpdated:",
          player.grid.map((row) => row.join(","))
        )
      }
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
      setIsConnected(false)
    }
  }, [token, user]) // Add user to dependency array

  return {
    socket,
    game,
    shotResult,
    error,
    setGame,
    setShotResult,
    setError,
    isConnected,
  }
}
