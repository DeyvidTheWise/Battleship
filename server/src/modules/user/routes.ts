import express from "express"
import {
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
} from "./controller"
import { authenticateToken, authorizeAdmin } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/me", authenticateToken, getProfile)

router.put("/me", authenticateToken, updateProfile)

router.get("/", authenticateToken, authorizeAdmin, getAllUsers)
router.get("/:id", authenticateToken, authorizeAdmin, getUserById)
router.delete("/:id", authenticateToken, authorizeAdmin, deleteUser)

export default router
