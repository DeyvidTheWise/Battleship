import React from "react"
import { QuickActionCard } from "molecules"
import styles from "./QuickActionsSection.module.css"

interface QuickActionsSectionProps {
  actions: {
    icon: "ship" | "chat" | "friend"
    title: string
    onClick: () => void
  }[]
}

const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  actions,
}) => {
  return (
    <div className={styles.quickActionsSection}>
      {actions.map((action, idx) => (
        <QuickActionCard
          key={idx}
          icon={action.icon}
          title={action.title}
          onClick={action.onClick}
        />
      ))}
    </div>
  )
}

export default QuickActionsSection
