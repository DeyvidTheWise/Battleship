import type { Request, Response } from "express"
import { getUserStats, updateStats } from "./model"

export const getUserStatistics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const statistics = await getUserStats(Number.parseInt(userId))

    if (!statistics) {
      return res.status(404).json({ message: "Statistics not found" })
    }

    res.json({ statistics })
  } catch (error) {
    console.error("Get statistics error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateUserStatistics = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const { gamesPlayed, gamesWon } = req.body

    // Calculate win rate
    const winRate = gamesPlayed > 0 ? (gamesWon / gamesPlayed) * 100 : 0

    const success = await updateStats(Number.parseInt(userId), {
      games_played: gamesPlayed,
      games_won: gamesWon,
      win_rate: winRate,
    })

    if (!success) {
      return res.status(404).json({ message: "Statistics not found" })
    }

    const updatedStats = await getUserStats(Number.parseInt(userId))
    res.json({ statistics: updatedStats })
  } catch (error) {
    console.error("Update statistics error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
