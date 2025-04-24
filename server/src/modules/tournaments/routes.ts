import express from "express"
import {
  getAllTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  joinTournament,
  leaveTournament,
} from "./controller"
import { authenticateToken, authorizeAdmin } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/", getAllTournaments)

router.get("/:id", getTournamentById)

router.post("/", authenticateToken, authorizeAdmin, createTournament)

router.put("/:id", authenticateToken, authorizeAdmin, updateTournament)

router.post("/:id/join", authenticateToken, joinTournament)

router.post("/:id/leave", authenticateToken, leaveTournament)

export default router
