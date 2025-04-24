import express from "express"
import { getUserStatistics, updateUserStatistics } from "./controller"
import { authenticateToken } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/user/:userId", getUserStatistics)

router.put("/user/:userId", authenticateToken, updateUserStatistics)

export default router
