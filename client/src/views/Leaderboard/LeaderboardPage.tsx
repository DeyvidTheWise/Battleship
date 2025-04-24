"use client"

import type React from "react"
import { useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/atoms/Select/Select"
import { Trophy, Medal, Award } from "lucide-react"
import "./LeaderboardPage.css"

const MOCK_LEADERBOARD_DATA = [
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

const CURRENT_USER = {
  id: 42,
  username: "YourUsername",
  elo: 1605,
  wins: 24,
  losses: 26,
  winRate: 48,
  rank: 8,
}

const LeaderboardPage: React.FC = () => {
  const [period, setPeriod] = useState<"all-time" | "weekly" | "monthly">(
    "all-time"
  )
  const [region, setRegion] = useState<
    "global" | "americas" | "europe" | "asia"
  >("global")

  return (
    <div className="min-h-screen bg-[#1A2A44] text-[#F5F7FA]">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Leaderboard</h1>
        </div>

        <div className="mb-8 rounded-lg border border-[#4ECDC4] bg-[#2D3748] p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1A2A44]">
                <span className="text-lg font-bold">#{CURRENT_USER.rank}</span>
              </div>
              <div>
                <h2 className="font-bold">{CURRENT_USER.username}</h2>
                <p className="text-sm text-[#A3BFFA]">Your Ranking</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-sm text-[#A3BFFA]">Elo</p>
                <p className="font-bold">{CURRENT_USER.elo}</p>
              </div>
              <div>
                <p className="text-sm text-[#A3BFFA]">Win Rate</p>
                <p className="font-bold">{CURRENT_USER.winRate}%</p>
              </div>
              <div>
                <p className="text-sm text-[#A3BFFA]">W/L</p>
                <p className="font-bold">
                  {CURRENT_USER.wins}/{CURRENT_USER.losses}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-4">
          <div className="w-full sm:w-auto">
            <Select
              value={period}
              onValueChange={(value) => setPeriod(value as any)}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-[#2D3748] border-[#4A4A4A]">
                <SelectValue placeholder="Time Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-time">All Time</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="w-full sm:w-auto">
            <Select
              value={region}
              onValueChange={(value) => setRegion(value as any)}
            >
              <SelectTrigger className="w-full sm:w-[180px] bg-[#2D3748] border-[#4A4A4A]">
                <SelectValue placeholder="Region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global">Global</SelectItem>
                <SelectItem value="americas">Americas</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-lg bg-[#2D3748] overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#4A4A4A] text-left">
                <th className="p-4 text-sm font-medium text-[#A3BFFA]">Rank</th>
                <th className="p-4 text-sm font-medium text-[#A3BFFA]">
                  Player
                </th>
                <th className="p-4 text-sm font-medium text-[#A3BFFA]">Elo</th>
                <th className="p-4 text-sm font-medium text-[#A3BFFA] hidden md:table-cell">
                  Win Rate
                </th>
                <th className="p-4 text-sm font-medium text-[#A3BFFA] hidden md:table-cell">
                  W/L
                </th>
              </tr>
            </thead>
            <tbody>
              {MOCK_LEADERBOARD_DATA.map((player, index) => (
                <tr
                  key={player.id}
                  className={`border-b border-[#4A4A4A] ${
                    index < 3 ? "bg-[#1A2A44]/30" : ""
                  }`}
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <Trophy className="mr-2 h-4 w-4 text-[#FFD700]" />
                      ) : index === 1 ? (
                        <Medal className="mr-2 h-4 w-4 text-[#C0C0C0]" />
                      ) : index === 2 ? (
                        <Award className="mr-2 h-4 w-4 text-[#CD7F32]" />
                      ) : (
                        <span className="mr-2 w-4 text-center">
                          {index + 1}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium">{player.username}</td>
                  <td className="p-4">{player.elo}</td>
                  <td className="p-4 hidden md:table-cell">
                    {player.winRate}%
                  </td>
                  <td className="p-4 hidden md:table-cell">
                    {player.wins}/{player.losses}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default LeaderboardPage
