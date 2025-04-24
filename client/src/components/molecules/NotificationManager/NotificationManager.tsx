import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../../../contexts/AuthContext"
import { connectSocket } from "../../../utils/Socket"
import { useToast } from "../../../contexts/ToastContext"
import GameInvitation from "../GameInvitation/GameInvitation"
import "./NotificationManager.css"

interface GameInvitationData {
  from: {
    id: number
    username: string
  }
  gameId: string
  code: string
}

export const NotificationManager: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [socket, setSocket] = useState<any>(null)
  const [gameInvitation, setGameInvitation] =
    useState<GameInvitationData | null>(null)

  useEffect(() => {
    if (!user) return

    const initSocket = async () => {
      try {
        const socket = await connectSocket()

        
        const token = localStorage.getItem("token")
        if (token) {
          socket.auth = { token }
          socket.connect()
        }

        setSocket(socket)

        
        socket.on("game_invitation", (data: GameInvitationData) => {
          setGameInvitation(data)
          
        })

        
        socket.on(
          "friend_request",
          (data: { from: { id: number; username: string } }) => {
            showToast({
              title: "Friend Request",
              description: `${data.from.username} sent you a friend request`,
              variant: "default",
            })
            
          }
        )

        
        socket.on("error", ({ message }: { message: string }) => {
          showToast({
            title: "Error",
            description: message,
            variant: "destructive",
          })
        })
      } catch (error) {
        console.error("Socket connection error:", error)
      }
    }

    initSocket()

    return () => {
      if (socket) {
        socket.off("game_invitation")
        socket.off("friend_request")
        socket.off("error")
        socket.disconnect()
      }
    }
  }, [user, showToast])

  const handleAcceptInvitation = () => {
    if (!socket || !gameInvitation) return

    socket.emit("join_game_by_code", { code: gameInvitation.code })
    setGameInvitation(null)
  }

  const handleDeclineInvitation = () => {
    setGameInvitation(null)
    
    if (socket && gameInvitation) {
      socket.emit("decline_invitation", { gameId: gameInvitation.gameId })
    }
  }

  return (
    <div className="notification-manager">
      {gameInvitation && (
        <GameInvitation
          from={gameInvitation.from}
          gameId={gameInvitation.gameId}
          code={gameInvitation.code}
          onAccept={handleAcceptInvitation}
          onDecline={handleDeclineInvitation}
        />
      )}
    </div>
  )
}

export default NotificationManager
