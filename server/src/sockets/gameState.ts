import { GameType } from "../services/gameService"
import { io } from "./socketManager"

export const games: Map<string, GameType> = new Map()
export const joinCodes: Map<string, string> = new Map()

export const updateGameList = () => {
  const gameList = Array.from(games.entries()).map(([id, game]) => ({
    id,
    player1: game.player1?.id,
    player2: game.player2?.id,
    status: game.status,
  }))
  io.emit("gameListUpdate", gameList)
}
