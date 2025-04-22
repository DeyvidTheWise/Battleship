import React from "react"
import { MatchHistoryEntry } from "molecules"
import styles from "./MatchHistoryList.module.css"

interface MatchHistoryListProps {
  matches: { opponent: string; outcome: "win" | "loss"; onReplay: () => void }[]
}

const MatchHistoryList: React.FC<MatchHistoryListProps> = ({ matches }) => {
  return (
    <div className={styles.matchHistoryList}>
      {matches.map((match, idx) => (
        <MatchHistoryEntry
          key={idx}
          opponent={match.opponent}
          outcome={match.outcome}
          onReplay={match.onReplay}
        />
      ))}
    </div>
  )
}

export default MatchHistoryList
