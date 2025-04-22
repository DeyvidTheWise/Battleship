import React from "react"
import { Text } from "atoms"
import { ChatMessageProps } from "@shared-types"
import styles from "./ChatMessage.module.css"

const ChatMessage: React.FC<ChatMessageProps> = ({
  sender,
  content,
  timestamp,
}) => {
  return (
    <div className={styles.chatMessage}>
      <Text content={`${sender}:`} variant="body" />
      <Text content={content} variant="body" />
      <Text
        content={new Date(timestamp).toLocaleTimeString()}
        variant="secondary"
      />
    </div>
  )
}

export default ChatMessage
