import express from "express"
import {
  getAllAchievements,
  getUserAchievements,
  unlockAchievement,
} from "./controller"
import { authenticateToken } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/", getAllAchievements)

router.get("/user/:userId", getUserAchievements)

router.post("/unlock", authenticateToken, unlockAchievement)

export default router
