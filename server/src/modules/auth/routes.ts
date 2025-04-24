import express from "express"
import {
  register,
  login,
  getCurrentUser,
  checkUsernameAvailability,
} from "./controller"
import { authMiddleware } from "../../shared/middleware/auth"

const router = express.Router()

router.post("/register", register)

router.post("/login", login)

router.get("/me", authMiddleware, getCurrentUser)

router.get("/check-username", checkUsernameAvailability)

export default router
