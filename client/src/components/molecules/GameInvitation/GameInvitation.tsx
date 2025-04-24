import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../../atoms/Button/Button"
import { X } from "lucide-react"
import "./GameInvitation.css"

interface GameInvitationProps {
  from: {
    id: number
    username: string
  }
  gameId: string
  code: string
  onAccept: () => void
  onDecline: () => void
}

export const GameInvitation: React.FC<GameInvitationProps> = ({
  from,
  gameId,
  code,
  onAccept,
  onDecline,
}) => {
  const [timeLeft, setTimeLeft] = useState(30) // 30 seconds to accept
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onDecline()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onDecline])

  const handleAccept = () => {
    onAccept()
    navigate(`/multiplayer?code=${code}`)
  }

  return (
    <div className="game-invitation">
      <div className="game-invitation-header">
        <h3>Game Invitation</h3>
        <button className="close-button" onClick={onDecline}>
          <X size={18} />
        </button>
      </div>
      <div className="game-invitation-content">
        <p>
          <strong>{from.username}</strong> has invited you to play a game of
          Battleship!
        </p>
        <div className="timer">Expires in: {timeLeft}s</div>
      </div>
      <div className="game-invitation-actions">
        <Button onClick={handleAccept} className="accept-button">
          Accept
        </Button>
        <Button
          onClick={onDecline}
          variant="outline"
          className="decline-button"
        >
          Decline
        </Button>
      </div>
    </div>
  )
}

export default GameInvitation
