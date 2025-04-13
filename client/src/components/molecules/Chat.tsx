import React, { useEffect, useState, useRef } from "react"
import { Text } from "../atoms/Text"
import Button from "../atoms/Button"
import { useSocket } from "../../hooks/useSocket"
import { useAuth } from "../../context/AuthContext"

interface Message {
  sender_id: string
  firstname: string
  lastname: string
  message: string
  sent_at: string
}

interface ChatProps {
  gameId?: string // For in-game chat
  friendId?: string // For direct messages
}

export const Chat: React.FC<ChatProps> = ({ gameId, friendId }) => {
  const { socket } = useSocket()
  const { user } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (socket) {
      if (gameId) {
        socket.emit("getGameMessages", gameId)
        socket.on("gameMessage", (msg: Message) => {
          setMessages((prev) => [...prev, msg])
        })
        socket.on("gameMessages", (msgs: Message[]) => {
          setMessages(msgs)
        })
      } else if (friendId) {
        socket.emit("getDirectMessages", friendId)
        socket.on("directMessage", (msg: Message) => {
          setMessages((prev) => [...prev, msg])
        })
        socket.on("directMessages", (msgs: Message[]) => {
          setMessages(msgs)
        })
      }

      return () => {
        socket.off("gameMessage")
        socket.off("gameMessages")
        socket.off("directMessage")
        socket.off("directMessages")
      }
    }
  }, [socket, gameId, friendId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (socket && message.trim() && user) {
      socket.emit("sendMessage", {
        gameId,
        receiverId: friendId,
        message,
      })
      setMessage("")
    }
  }

  return (
    <div
      className="glass-container"
      style={{
        marginTop: "1rem",
        maxHeight: "300px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Text variant="h2" style={{ marginBottom: "1rem" }}>
        {gameId ? "Game Chat" : "Direct Messages"}
      </Text>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "1rem" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "0.5rem" }}>
            <Text>
              <strong>
                {msg.firstname} {msg.lastname}
              </strong>{" "}
              ({new Date(msg.sent_at).toLocaleTimeString()}): {msg.message}
            </Text>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          style={{ flex: 1, padding: "0.5rem" }}
          placeholder="Type a message..."
        />
        <Button onClick={handleSendMessage} variant="primary">
          Send
        </Button>
      </div>
    </div>
  )
}
