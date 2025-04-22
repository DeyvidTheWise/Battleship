import { Request, Response } from "express"
import { createGame, placeShips, fireShot, getGameState } from "./game.service"
import { Ship } from "@shared-types"

export const createGameController = async (req: Request, res: Response) => {
  try {
    const { mode, player2_id, difficulty } = req.body
    const player1_id = (req as any).user.user_id
    const game = await createGame(mode, player1_id, player2_id, difficulty)
    res.status(201).json(game)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const placeShipsController = async (req: Request, res: Response) => {
  try {
    const { game_id } = req.body
    const user_id = (req as any).user.user_id
    const ships: Ship[] = req.body.ships
    await placeShips(game_id, user_id, ships)
    res.status(200).json({ message: "Ships placed successfully" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const fireShotController = async (req: Request, res: Response) => {
  try {
    const { game_id, cell } = req.body
    const user_id = (req as any).user.user_id
    const result = await fireShot(game_id, user_id, cell)
    res.status(200).json(result)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getGameStateController = async (req: Request, res: Response) => {
  try {
    const { game_id } = req.params
    const user_id = (req as any).user.user_id
    const gameState = await getGameState(game_id, user_id)
    res.status(200).json(gameState)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
