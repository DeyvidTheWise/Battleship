import React, { useState } from "react"
import { ChatMessage } from "molecules"
import { ChatMessageProps } from "@shared-types"
import styles from "./ChatPanel.module.css"

interface ChatPanelProps {
  messages: ChatMessageProps[]
  onSendMessage: (message: string) => void
}

const ChatPanel: React.FC<ChatPanelProps> = ({ messages, onSendMessage }) => {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <div className={styles.chatPanel}>
      <div className={styles.messages}>
        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            sender={msg.sender}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
      </div>
      <div className={styles.inputArea}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className={styles.input}
        />
        <button onClick={handleSend} className={styles.sendButton}>
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatPanel
