import { Request, Response } from "express"
import { getUserById, updateUserBio } from "../services/userService"
import { db } from "../services/dbService"
import { RowDataPacket } from "mysql2"

export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await getUserById(req.params.userId)
    res.json(user)
  } catch (error) {
    res.status(404).json({ error: (error as Error).message })
  }
}

export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user || req.user.id !== req.params.userId) {
    res.status(403).json({ error: "Unauthorized" })
    return
  }

  const { bio } = req.body
  try {
    await updateUserBio(req.user.id, bio)
    res.json({ message: "Bio updated successfully" })
  } catch (error) {
    res.status(500).json({ error: "Failed to update bio" })
  }
}

export const getGameHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT gh.*, u.firstname, u.lastname FROM game_history gh LEFT JOIN users u ON gh.opponent_id = u.id WHERE gh.user_id = ? ORDER BY played_at DESC LIMIT 10",
      [req.params.userId]
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch game history" })
  }
}
