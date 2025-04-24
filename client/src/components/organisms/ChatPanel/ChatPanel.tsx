"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/atoms/Button/Button"
import { Input } from "../../../components/atoms/Input/Input"
import "./ChatPanel.css"

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: Date
}

interface ChatPanelProps {
  gameId: string
  username: string
  opponent: string
}

export const ChatPanel: React.FC<ChatPanelProps> = ({ gameId, username, opponent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      sender: opponent,
      content: "Good luck!",
      timestamp: new Date(Date.now() - 60000),
    },
  ])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const message: ChatMessage = {
      id: Date.now().toString(),
      sender: username,
      content: newMessage,
      timestamp: new Date(),
    }

    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="chat-panel">
      <div className="chat-panel-header">
        <h3>Game Chat</h3>
        <div className="chat-panel-opponent">Playing against: {opponent}</div>
      </div>

      <div className="chat-panel-messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`chat-message ${message.sender === username ? "own-message" : "other-message"}`}
          >
            <div className="message-header">
              <span className="message-sender">{message.sender}</span>
              <span className="message-time">{message.timestamp.toLocaleTimeString()}</span>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
      </div>

      <div className="chat-panel-input">
        <Input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="chat-input"
        />
        <Button onClick={handleSendMessage} className="send-button">
          Send
        </Button>
      </div>
    </div>
  )
}

export default ChatPanel
