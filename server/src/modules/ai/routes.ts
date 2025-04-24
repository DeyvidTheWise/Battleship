import express from "express"
import { getDifficultyLevels } from "./controller"

const router = express.Router()

router.get("/difficulty-levels", getDifficultyLevels)

export default router
