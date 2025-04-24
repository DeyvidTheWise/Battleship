import express from "express"
import { getMessages, sendMessage, markAsRead } from "./controller"
import { authenticateToken } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/:userId", authenticateToken, getMessages)

router.post("/", authenticateToken, sendMessage)

router.put("/:userId/read", authenticateToken, markAsRead)

export default router
