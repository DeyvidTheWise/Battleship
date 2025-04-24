import type { Request, Response } from "express"
import { getAIDifficultyLevels } from "./model"

export const getDifficultyLevels = async (req: Request, res: Response) => {
  try {
    const levels = await getAIDifficultyLevels()
    res.json({ levels })
  } catch (error) {
    console.error("Get AI levels error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
