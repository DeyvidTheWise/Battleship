import React, { useEffect, useRef } from "react"
import { Button } from "../../../components/atoms/Button/Button"
import { Input } from "../../../components/atoms/Input/Input"
import "./ChatInterface.css"

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}

interface ChatInterfaceProps {
  messages: Message[]
  username: string
  onSendMessage: (message: string) => void
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  username,
  onSendMessage,
}) => {
  const [newMessage, setNewMessage] = React.useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    onSendMessage(newMessage)
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <>
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="no-messages">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.senderId === "current-user" ? "sent" : ""
              }`}
            >
              <div className="chat-message-avatar">
                {message.senderId === "current-user"
                  ? username.substring(0, 2).toUpperCase()
                  : messages[0]?.senderId.substring(0, 2).toUpperCase()}
              </div>
              <div className="chat-message-content">
                <div className="chat-message-text">{message.content}</div>
                <div className="chat-message-time">
                  {formatTime(message.timestamp)}
                  {message.senderId === "current-user" && (
                    <span className="message-status">
                      {message.read ? " ✓✓" : " ✓"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="chat-input-field"
        />
        <Button onClick={handleSendMessage} className="chat-input-send">
          Send
        </Button>
      </div>
    </>
  )
}

export default ChatInterface
