import React from "react"
import { Text, Button } from "atoms"
import styles from "./MatchHistoryEntry.module.css"

interface MatchHistoryEntryProps {
  opponent: string
  outcome: "win" | "loss"
  onReplay: () => void
}

const MatchHistoryEntry: React.FC<MatchHistoryEntryProps> = ({
  opponent,
  outcome,
  onReplay,
}) => {
  return (
    <div className={styles.matchHistoryEntry}>
      <Text content={`vs ${opponent}`} variant="body" />
      <Text content={outcome} variant="body" />
      <Button text="Replay" onClick={onReplay} variant="secondary" />
    </div>
  )
}

export default MatchHistoryEntry
