import React from "react"
import { StatItem } from "atoms"
import styles from "./StatsSection.module.css"

interface StatsSectionProps {
  stats: { label: string; value: string | number }[]
}

const StatsSection: React.FC<StatsSectionProps> = ({ stats }) => {
  return (
    <div className={styles.statsSection}>
      {stats.map((stat, idx) => (
        <StatItem key={idx} label={stat.label} value={stat.value} />
      ))}
    </div>
  )
}

export default StatsSection
