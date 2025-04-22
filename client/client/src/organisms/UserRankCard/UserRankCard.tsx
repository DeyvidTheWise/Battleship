import React from "react"
import { Text } from "atoms"
import styles from "./UserRankCard.module.css"

interface UserRankCardProps {
  rank: number
  username: string
  elo: number
  winRate: string
}

const UserRankCard: React.FC<UserRankCardProps> = ({
  rank,
  username,
  elo,
  winRate,
}) => {
  return (
    <div className={styles.userRankCard}>
      <Text content={`Rank: ${rank}`} variant="body" />
      <Text content={username} variant="body" />
      <Text content={`Elo: ${elo}`} variant="body" />
      <Text content={`Win Rate: ${winRate}`} variant="body" />
    </div>
  )
}

export default UserRankCard
