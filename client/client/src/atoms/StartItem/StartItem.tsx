import React from "react"
import styles from "./StartItem.module.css"

interface StatItemProps {
  label: string
  value: string | number
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => {
  return (
    <div className={styles.statItem}>
      <span className={styles.label}>{label}:</span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}

export default StatItem
