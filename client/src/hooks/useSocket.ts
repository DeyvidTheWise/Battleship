"use client"

import { useState, useEffect, useCallback } from "react"
import { connectSocket } from "../utils/Socket"
import { useAuth } from "../contexts/AuthContext"
import { useToast } from "../contexts/ToastContext"

export function useSocket() {
  const [socket, setSocket] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { showToast } = useToast()

  const connect = useCallback(async () => {
    if (!user) {
      setIsLoading(false)
      return null
    }

    try {
      setIsLoading(true)
      const newSocket = await connectSocket()

      const token = localStorage.getItem("token")
      if (token) {
        newSocket.auth = { token }
        newSocket.connect()
      }

      newSocket.on("connect", () => {
        setIsConnected(true)
        setIsLoading(false)
      })

      newSocket.on("disconnect", () => {
        setIsConnected(false)
      })

      newSocket.on("connect_error", (error: any) => {
        console.error("Socket connection error:", error)
        showToast({
          title: "Connection Error",
          description: "Failed to connect to game server",
          variant: "destructive",
        })
        setIsLoading(false)
      })

      setSocket(newSocket)
      return newSocket
    } catch (error) {
      console.error("Socket initialization error:", error)
      showToast({
        title: "Connection Error",
        description: "Failed to initialize socket connection",
        variant: "destructive",
      })
      setIsLoading(false)
      return null
    }
  }, [user, showToast])

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect()
      setSocket(null)
      setIsConnected(false)
    }
  }, [socket])

  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  return {
    socket,
    isConnected,
    isLoading,
    connect,
    disconnect,
  }
}
