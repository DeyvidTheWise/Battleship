"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "../../atoms/Button/Button"
import { Trophy, Medal, Award } from "lucide-react"
import "./Leaderboard.css"

interface LeaderboardPlayer {
  id: number
  username: string
  elo: number
  wins: number
  losses: number
  winRate: number
}

interface LeaderboardProps {
  timeFrame?: "all-time" | "weekly" | "monthly"
  region?: "global" | "americas" | "europe" | "asia"
  currentUser?: LeaderboardPlayer
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  timeFrame = "all-time",
  region = "global",
  currentUser,
}) => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [isLoading, setIsLoading] = useState(true)

  
  useEffect(() => {
    const mockPlayers: LeaderboardPlayer[] = [
      {
        id: 1,
        username: "Admiral_Awesome",
        elo: 1850,
        wins: 42,
        losses: 12,
        winRate: 78,
      },
      {
        id: 2,
        username: "SeaBattleKing",
        elo: 1780,
        wins: 38,
        losses: 15,
        winRate: 72,
      },
      {
        id: 3,
        username: "NavalCommander",
        elo: 1720,
        wins: 35,
        losses: 18,
        winRate: 66,
      },
      {
        id: 4,
        username: "ShipDestroyer",
        elo: 1690,
        wins: 31,
        losses: 19,
        winRate: 62,
      },
      {
        id: 5,
        username: "OceanMaster",
        elo: 1650,
        wins: 29,
        losses: 21,
        winRate: 58,
      },
      {
        id: 6,
        username: "BattleshipPro",
        elo: 1620,
        wins: 27,
        losses: 23,
        winRate: 54,
      },
      {
        id: 7,
        username: "FleetAdmiral",
        elo: 1590,
        wins: 25,
        losses: 25,
        winRate: 50,
      },
      {
        id: 8,
        username: "TorpedoExpert",
        elo: 1560,
        wins: 23,
        losses: 27,
        winRate: 46,
      },
      {
        id: 9,
        username: "NavyStrategist",
        elo: 1530,
        wins: 21,
        losses: 29,
        winRate: 42,
      },
      {
        id: 10,
        username: "CaptainSonar",
        elo: 1500,
        wins: 20,
        losses: 30,
        winRate: 40,
      },
    ]

    
    setTimeout(() => {
      setPlayers(mockPlayers)
      setIsLoading(false)
    }, 1000)
  }, [timeFrame, region])

  return (
    <div className="leaderboard">
      <div className="leaderboard-header">
        <h2 className="leaderboard-title">Top Players</h2>
        <div className="leaderboard-filters">
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "all-time" ? "active" : ""}
          >
            All Time
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "monthly" ? "active" : ""}
          >
            Monthly
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={timeFrame === "weekly" ? "active" : ""}
          >
            Weekly
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="leaderboard-loading">Loading leaderboard data...</div>
      ) : (
        <div className="leaderboard-table">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>ELO</th>
                <th className="hide-mobile">Win Rate</th>
                <th className="hide-mobile">W/L</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr
                  key={player.id}
                  className={
                    currentUser?.id === player.id ? "current-user" : ""
                  }
                >
                  <td>
                    <div className="rank">
                      {index === 0 ? (
                        <Trophy className="rank-icon gold" />
                      ) : index === 1 ? (
                        <Medal className="rank-icon silver" />
                      ) : index === 2 ? (
                        <Award className="rank-icon bronze" />
                      ) : (
                        <span>{index + 1}</span>
                      )}
                    </div>
                  </td>
                  <td className="player-name">{player.username}</td>
                  <td className="elo">{player.elo}</td>
                  <td className="win-rate hide-mobile">{player.winRate}%</td>
                  <td className="record hide-mobile">
                    {player.wins}/{player.losses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {currentUser && (
        <div className="current-user-rank">
          <div className="rank-label">Your Ranking</div>
          <div className="rank-details">
            <div className="rank-position">
              #{players.findIndex((p) => p.id === currentUser.id) + 1}
            </div>
            <div className="rank-stats">
              <div className="rank-elo">ELO: {currentUser.elo}</div>
              <div className="rank-win-rate">
                Win Rate: {currentUser.winRate}%
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Leaderboard
