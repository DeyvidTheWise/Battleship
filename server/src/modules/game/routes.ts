import express from "express"
import { getLeaderboard, getUserGameHistory } from "./controller"
import { authenticateToken } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/leaderboard", getLeaderboard)

router.get("/history", authenticateToken, getUserGameHistory)

export default router
