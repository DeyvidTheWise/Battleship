import type { Request, Response } from "express"
import {
  getAchievements,
  getUserAchievementsList,
  addUserAchievement,
  checkUserHasAchievement,
} from "./model"

export const getAllAchievements = async (req: Request, res: Response) => {
  try {
    const achievements = await getAchievements()
    res.json({ achievements })
  } catch (error) {
    console.error("Get achievements error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getUserAchievements = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params
    const achievements = await getUserAchievementsList(Number.parseInt(userId))
    res.json({ achievements })
  } catch (error) {
    console.error("Get user achievements error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const unlockAchievement = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const { achievementId } = req.body

    const hasAchievement = await checkUserHasAchievement(userId, achievementId)
    if (hasAchievement) {
      return res.status(400).json({ message: "Achievement already unlocked" })
    }

    await addUserAchievement(userId, achievementId)
    res.status(201).json({ message: "Achievement unlocked" })
  } catch (error) {
    console.error("Unlock achievement error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
