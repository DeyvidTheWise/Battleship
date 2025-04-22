import React from "react"
import { Icon, Text, Button } from "atoms"
import styles from "./QuickActionCard.module.css"

interface QuickActionCardProps {
  icon: "ship" | "chat" | "friend"
  title: string
  onClick: () => void
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  icon,
  title,
  onClick,
}) => {
  return (
    <div className={styles.quickActionCard}>
      <Icon name={icon} variant="active" />
      <Text content={title} variant="body" />
      <Button text="Play" onClick={onClick} />
    </div>
  )
}

export default QuickActionCard
