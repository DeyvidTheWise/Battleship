import { Router, Request, Response } from "express"
import { makeAIMove } from "./ai.service"
import { getGameState } from "../game/game.service"

// Define the shape of the request body
interface AIMoveRequestBody {
  game_id: string
  difficulty: "easy" | "medium" | "hard"
}

const router = Router()

router.post(
  "/move",
  async (req: Request<{}, {}, AIMoveRequestBody>, res: Response) => {
    const { game_id, difficulty } = req.body
    const user_id = req.user?.user_id
    if (!user_id) {
      return res.status(401).json({ error: "Unauthorized" })
    }
    const opponentState = await getGameState(game_id, user_id)
    const move = await makeAIMove(game_id, difficulty, opponentState)
    res.status(200).json(move)
  }
)

export default router
