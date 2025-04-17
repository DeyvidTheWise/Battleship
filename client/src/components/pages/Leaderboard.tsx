import React, { useEffect, useState } from "react"
import { Text, CenteredTitle } from "../atoms"
import { PageLayout } from "../organisms"
import { useAuth } from "../../context/AuthContext"

interface LeaderboardEntry {
  id: string
  firstname: string
  lastname: string
  xp: number
}

const Leaderboard: React.FC = () => {
  const { user } = useAuth()
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leaderboard")
        if (!response.ok) throw new Error("Failed to fetch leaderboard")
        const data = await response.json()
        setLeaderboard(data)
      } catch (err) {
        console.error(err)
      }
    }

    fetchLeaderboard()
  }, [])

  return (
    <PageLayout>
      <CenteredTitle>Leaderboard</CenteredTitle>
      {leaderboard.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Name</th>
              <th>XP</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((entry, index) => (
              <tr key={entry.id}>
                <td>{index + 1}</td>
                <td>{`${entry.firstname} ${entry.lastname}`}</td>
                <td>{entry.xp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Text style={{ textAlign: "center" }}>
          No leaderboard data available.
        </Text>
      )}
    </PageLayout>
  )
}

export default Leaderboard
