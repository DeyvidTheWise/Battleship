import { Request, Response } from "express"
import { db } from "../services/dbService"
import { RowDataPacket } from "mysql2"

export const getLeaderboard = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT id, firstname, lastname, xp FROM users ORDER BY xp DESC LIMIT 10"
    )
    res.json(rows)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch leaderboard" })
  }
}
