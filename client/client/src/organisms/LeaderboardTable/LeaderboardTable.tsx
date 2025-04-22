import React from "react"
import { TableRow } from "molecules"
import styles from "./LeaderboardTable.module.css"

interface LeaderboardTableProps {
  rows: { rank: number; username: string; elo: number; winRate: string }[]
  highlightTop?: number
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  rows,
  highlightTop = 10,
}) => {
  return (
    <table className={styles.leaderboardTable}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Username</th>
          <th>Elo</th>
          <th>Win Rate</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => (
          <TableRow
            key={idx}
            data={[row.rank, row.username, row.elo, row.winRate]}
            isHighlighted={idx < highlightTop}
          />
        ))}
      </tbody>
    </table>
  )
}

export default LeaderboardTable
