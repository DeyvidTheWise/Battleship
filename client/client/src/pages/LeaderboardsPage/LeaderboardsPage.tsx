import React from "react"
import { LeaderboardsPageTemplate } from "templates"
import styles from "./LeaderboardsPage.module.css"

const LeaderboardsPage: React.FC = () => {
  const userRank = { rank: 5, username: "You", elo: 1200, winRate: "60%" }

  const leaderboardData = [
    { rank: 1, username: "Player1", elo: 1500, winRate: "75%" },
    { rank: 2, username: "Player2", elo: 1400, winRate: "70%" },
    { rank: 3, username: "Player3", elo: 1300, winRate: "65%" },
    { rank: 4, username: "Player4", elo: 1250, winRate: "62%" },
    { rank: 5, username: "You", elo: 1200, winRate: "60%" },
  ]

  const handlePeriodChange = (period: string) => {
    console.log(`Selected period: ${period}`)
  }

  const handleRegionChange = (region: string) => {
    console.log(`Selected region: ${region}`)
  }

  return (
    <div className={styles.leaderboardsPage}>
      <LeaderboardsPageTemplate
        userRank={userRank}
        leaderboardData={leaderboardData}
        onPeriodChange={handlePeriodChange}
        onRegionChange={handleRegionChange}
      />
    </div>
  )
}

export default LeaderboardsPage
