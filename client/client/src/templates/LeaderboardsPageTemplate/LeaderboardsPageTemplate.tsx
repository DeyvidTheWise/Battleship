import React from "react"
import { UserRankCard, FiltersSection, LeaderboardTable } from "organisms"
import styles from "./LeaderboardsPageTemplate.module.css"

interface LeaderboardsPageTemplateProps {
  userRank: { rank: number; username: string; elo: number; winRate: string }
  leaderboardData: {
    rank: number
    username: string
    elo: number
    winRate: string
  }[]
  onPeriodChange: (period: string) => void
  onRegionChange: (region: string) => void
}

const LeaderboardsPageTemplate: React.FC<LeaderboardsPageTemplateProps> = ({
  userRank,
  leaderboardData,
  onPeriodChange,
  onRegionChange,
}) => {
  return (
    <div className={styles.leaderboardsPageTemplate}>
      <UserRankCard
        rank={userRank.rank}
        username={userRank.username}
        elo={userRank.elo}
        winRate={userRank.winRate}
      />
      <FiltersSection
        onPeriodChange={onPeriodChange}
        onRegionChange={onRegionChange}
      />
      <LeaderboardTable rows={leaderboardData} />
    </div>
  )
}

export default LeaderboardsPageTemplate
