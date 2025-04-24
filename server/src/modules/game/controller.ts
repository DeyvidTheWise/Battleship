import type { Request, Response } from "express"
import { getLeaderboardData, getUserHistory } from "./model"

export const getLeaderboard = async (req: Request, res: Response) => {
  try {
    const leaderboard = await getLeaderboardData()
    res.json({ leaderboard })
  } catch (error) {
    console.error("Leaderboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getUserGameHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const history = await getUserHistory(userId)
    res.json({ history })
  } catch (error) {
    console.error("Game history error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
