import React from "react"
import { Badge, Text } from "atoms"
import styles from "./AchievementCard.module.css"

interface AchievementCardProps {
  label: string
  description: string
  isUnlocked: boolean
}

const AchievementCard: React.FC<AchievementCardProps> = ({
  label,
  description,
  isUnlocked,
}) => {
  return (
    <div className={styles.achievementCard}>
      <Badge isUnlocked={isUnlocked} label={label} />
      <Text content={description} variant="secondary" />
    </div>
  )
}

export default AchievementCard
