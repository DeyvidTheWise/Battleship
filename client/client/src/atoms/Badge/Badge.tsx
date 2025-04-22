import React from "react"
import styles from "./Badge.module.css"

interface BadgeProps {
  isUnlocked: boolean
  label: string
}

const Badge: React.FC<BadgeProps> = ({ isUnlocked, label }) => {
  return (
    <div
      className={`${styles.badge} ${
        isUnlocked ? styles.unlocked : styles.locked
      }`}
    >
      {label}
    </div>
  )
}

export default Badge
