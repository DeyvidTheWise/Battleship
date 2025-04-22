import React from "react"
import { AchievementCard } from "molecules"
import styles from "./AchievementsGrid.module.css"

interface AchievementsGridProps {
  achievements: { label: string; description: string; isUnlocked: boolean }[]
}

const AchievementsGrid: React.FC<AchievementsGridProps> = ({
  achievements,
}) => {
  return (
    <div className={styles.achievementsGrid}>
      {achievements.map((achievement, idx) => (
        <AchievementCard
          key={idx}
          label={achievement.label}
          description={achievement.description}
          isUnlocked={achievement.isUnlocked}
        />
      ))}
    </div>
  )
}

export default AchievementsGrid
