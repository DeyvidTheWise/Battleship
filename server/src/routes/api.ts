import express from "express"
import { db } from "../services/dbService"

const router = express.Router()

router.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await db.query(
      "SELECT username, xp FROM Users ORDER BY xp DESC LIMIT 10"
    )
    res.json(leaderboard)
  } catch (error) {
    res.status(500).json({ error: (error as Error).message })
  }
})

export default router
