import { Router, Request, Response } from "express"
import {
  createGameController,
  placeShipsController,
  fireShotController,
  getGameStateController,
} from "./game.controller"
import { authenticate } from "../middleware/auth"

interface CreateGameRequestBody {
  mode: string
  player2_id?: string
  difficulty?: string
}

interface PlaceShipsRequestBody {
  game_id: string
  ships: Array<{
    name: string
    length: number
    position: string
    orientation: "horizontal" | "vertical"
  }>
}

interface FireShotRequestBody {
  game_id: string
  cell: string
}

const router = Router()

router.post(
  "/create",
  authenticate,
  async (req: Request<{}, {}, CreateGameRequestBody>, res: Response) => {
    await createGameController(req, res)
  }
)

router.post(
  "/place-ships",
  authenticate,
  async (req: Request<{}, {}, PlaceShipsRequestBody>, res: Response) => {
    await placeShipsController(req, res)
  }
)

router.post(
  "/shot",
  authenticate,
  async (req: Request<{}, {}, FireShotRequestBody>, res: Response) => {
    await fireShotController(req, res)
  }
)

router.get(
  "/state/:game_id",
  authenticate,
  async (req: Request<{ game_id: string }>, res: Response) => {
    await getGameStateController(req, res)
  }
)

export default router
