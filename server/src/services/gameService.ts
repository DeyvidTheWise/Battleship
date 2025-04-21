// server/src/services/gameService.ts
import { v4 as uuidv4 } from "uuid"
import { io } from "../sockets/socketManager"
import {
  Game as GameType,
  Player,
  Ship as ShipType,
  Coordinate,
} from "@shared-types/game"
import { updateUserXp } from "./userService"
import { db } from "./dbService"

const GRID_SIZE = 10

export interface ShotResult {
  shooter: string
  x: number
  y: number
  hit: boolean
  sunk: boolean
  gameOver: boolean
}

const SHIPS: ShipType[] = [
  {
    name: "Carrier",
    size: 5,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Battleship",
    size: 4,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Cruiser",
    size: 3,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Submarine",
    size: 3,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
  {
    name: "Destroyer",
    size: 2,
    coordinates: [],
    hits: 0,
    isSunk: false,
    isHorizontal: true,
    placed: false,
  },
]

const games: Map<string, GameType> = new Map()
const joinCodes: Map<string, string> = new Map()

const generateJoinCode = (): string => {
  const code = Math.floor(100000 + Math.random() * 900000).toString() // Random 6-digit number
  return code
}

export const createGame = (
  player1Id: string,
  isSinglePlayer: boolean
): GameType => {
  console.log(
    "Creating game for player:",
    player1Id,
    "isSinglePlayer:",
    isSinglePlayer
  )

  // Clear any existing games for this player
  const existingGames = Array.from(games.entries()).filter(
    ([_, g]) => g.player1?.id === player1Id || g.player2?.id === player1Id
  )
  for (const [gameId, game] of existingGames) {
    console.log(
      "Removing existing game for player:",
      player1Id,
      "Game ID:",
      gameId
    )
    if (game.joinCode) joinCodes.delete(game.joinCode)
    games.delete(gameId)
  }

  const player1: Player = {
    id: player1Id,
    ships: [],
    grid: Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "empty")
    ),
  }

  const game: GameType = {
    id: uuidv4(),
    joinCode: isSinglePlayer ? null : generateJoinCode(),
    player1,
    player2: null,
    currentTurn: player1Id,
    status: "setup",
    winner: null,
    createdAt: Date.now(),
  }

  if (isSinglePlayer) {
    const aiPlayer: Player = {
      id: "AI",
      ships: [],
      grid: Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => "empty")
      ),
    }
    placeAIShips(aiPlayer)
    game.player2 = aiPlayer
    console.log("AI player initialized:", aiPlayer)
    console.log(
      "Serialized gameUpdated payload:",
      JSON.stringify(game, null, 2)
    )
    io.to(game.id).emit("gameUpdated", game)
  }

  console.log(
    "Player 1 grid initialization:",
    player1.grid.map((row) => row.join(","))
  )
  if (game.player2) {
    console.log(
      "Player 2 grid initialization:",
      game.player2.grid.map((row) => row.join, ",")
    )
  }

  games.set(game.id, game)
  if (game.joinCode) {
    joinCodes.set(game.joinCode, game.id)
  }
  console.log("Game created:", game)
  return game
}

export const findGameByJoinCode = (joinCode: string): GameType | undefined => {
  const gameId = joinCodes.get(joinCode)
  return gameId ? games.get(gameId) : undefined
}

export const joinGame = (gameId: string, player2Id: string): GameType => {
  const game = games.get(gameId)
  if (!game) {
    console.log("Game not found for gameId:", gameId)
    console.log(
      "Current games in map:",
      Array.from(games.entries()).map(([id, g]) => ({
        id,
        player1: g.player1?.id,
        player2: g.player2?.id,
      }))
    )
    throw new Error("Game not found")
  }
  console.log("Joining game:", {
    gameId,
    player1: game.player1?.id,
    player2: game.player2?.id,
    joiningPlayer: player2Id,
  })

  // Clear any existing games for the joining player, excluding the current game
  const existingGames = Array.from(games.entries()).filter(
    ([id, g]) =>
      id !== gameId &&
      (g.player1?.id === player2Id || g.player2?.id === player2Id)
  )
  for (const [existingGameId, existingGame] of existingGames) {
    console.log(
      "Removing existing game for joining player:",
      player2Id,
      "Game ID:",
      existingGameId
    )
    if (existingGame.joinCode) joinCodes.delete(existingGame.joinCode)
    games.delete(existingGameId)
  }

  // Re-fetch the game to ensure it's still available
  const updatedGame = games.get(gameId)
  if (!updatedGame) {
    console.log("Game no longer exists after clearing stale state:", gameId)
    throw new Error("Game not found")
  }

  if (
    updatedGame.player1?.id === player2Id ||
    updatedGame.player2?.id === player2Id
  ) {
    console.log("Player already in game:", player2Id)
    throw new Error("You are already in this game")
  }

  if (updatedGame.player2) {
    console.log("Game already has two players:", {
      player1: updatedGame.player1?.id,
      player2: updatedGame.player2?.id,
    })
    throw new Error("Game already has two players")
  }

  const player2: Player = {
    id: player2Id,
    ships: [],
    grid: Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "empty")
    ),
  }
  updatedGame.player2 = player2
  console.log("Game after joining:", {
    player1: updatedGame.player1?.id,
    player2: updatedGame.player2?.id,
  })
  return updatedGame
}

export const placeShip = (
  gameId: string,
  playerId: string,
  shipName: string,
  coordinates: { x: number; y: number }[],
  isHorizontal: boolean
): void => {
  try {
    const game = games.get(gameId)
    if (!game) {
      console.error("Game not found for gameId:", gameId)
      throw new Error("Game not found")
    }

    const player = game.player1?.id === playerId ? game.player1 : game.player2
    if (!player) {
      console.error(
        "Player not found for playerId:",
        playerId,
        "Game players:",
        {
          player1: game.player1?.id,
          player2: game.player2?.id,
        }
      )
      throw new Error("Player not found")
    }

    console.log("Placing ship for player:", player.id, "Player ID:", playerId)
    console.log("Game state before placement:", {
      player1Id: game.player1?.id,
      player2Id: game.player2?.id,
    })
    console.log(
      "Player grid before placement:",
      player.grid.map((row) => row.join(","))
    )

    const shipSpec = SHIPS.find((s) => s.name === shipName)
    if (!shipSpec) {
      console.error("Invalid ship name:", shipName)
      throw new Error("Invalid ship name")
    }

    if (coordinates.length !== shipSpec.size) {
      console.error("Invalid ship size:", { shipName, coordinates })
      throw new Error("Invalid ship size")
    }

    console.log("Attempting to place ship:", {
      shipName,
      coordinates,
      isHorizontal,
    })

    for (const { x, y } of coordinates) {
      if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
        console.error("Invalid coordinates:", { x, y })
        throw new Error("Invalid ship placement: Coordinates out of bounds")
      }
      if (player.grid[y][x] !== "empty") {
        console.error("Position already occupied:", {
          x,
          y,
          gridValue: player.grid[y][x],
        })
        console.log(
          "Current grid state:",
          player.grid.map((row) => row.join(","))
        )
        throw new Error("Invalid ship placement: Position already occupied")
      }
    }

    const ship: ShipType = {
      name: shipName,
      size: shipSpec.size,
      coordinates,
      hits: 0,
      isSunk: false,
      isHorizontal,
      placed: true,
    }
    player.ships.push(ship)
    coordinates.forEach(({ x, y }) => {
      player.grid[y][x] = "ship"
    })

    console.log("Ship placed successfully:", { shipName, coordinates })
    console.log(
      "Player grid after placement:",
      player.grid.map((row) => row.join(","))
    )

    games.set(gameId, game)
    console.log("Emitting gameUpdated event with game state:", {
      gameId: game.id,
      player1Ships: game.player1?.ships,
      player2Ships: game.player2?.ships,
    })
    console.log(
      "Serialized gameUpdated payload:",
      JSON.stringify(game, null, 2)
    )
    io.to(gameId).emit("gameUpdated", game)
  } catch (error) {
    console.error("Error in placeShip:", error)
    throw error // Ensure the error is propagated to the client
  }
}

const saveGameHistory = async (
  userId: string,
  opponentId: string,
  result: "win" | "loss" | "draw",
  xpEarned: number
) => {
  const id = uuidv4()
  await db.query(
    "INSERT INTO game_history (id, user_id, opponent_id, result, xp_earned) VALUES (?, ?, ?, ?, ?)",
    [id, userId, opponentId, result, xpEarned]
  )
}

const validateShot = (x: number, y: number, grid: string[][]): boolean => {
  return (
    x >= 0 &&
    x < GRID_SIZE &&
    y >= 0 &&
    y < GRID_SIZE &&
    grid[y][x] !== "hit" &&
    grid[y][x] !== "miss"
  )
}

const processHit = (
  x: number,
  y: number,
  grid: string[][],
  ships: ShipType[]
): { hit: boolean; sunk: boolean } => {
  const hit = grid[y][x] === "ship"
  grid[y][x] = hit ? "hit" : "miss"

  let sunk = false
  if (hit) {
    const ship = ships.find((s) =>
      s.coordinates.some((coord) => coord.x === x && coord.y === y)
    )
    if (ship) {
      ship.hits++
      if (ship.hits === ship.size) {
        ship.isSunk = true
        sunk = true
      }
    }
  }

  return { hit, sunk }
}

export const fireShot = (
  gameId: string,
  x: number,
  y: number,
  playerId: string
): ShotResult => {
  const game = games.get(gameId)
  if (!game) throw new Error("Game not found")
  if (game.status !== "playing") throw new Error("Game not in playing phase")
  if (game.currentTurn !== playerId) throw new Error("Not your turn")

  const opponent = game.player1?.id === playerId ? game.player2 : game.player1
  if (!opponent) throw new Error("Opponent not found")

  if (!validateShot(x, y, opponent.grid)) throw new Error("Invalid shot")

  const { hit, sunk } = processHit(x, y, opponent.grid, opponent.ships)

  const gameOver = opponent.ships.every((ship) => ship.isSunk)
  if (!gameOver) {
    game.currentTurn = opponent.id
  } else {
    game.status = "finished"
    game.winner = playerId
    if (playerId !== "anonymous" && opponent.id !== "anonymous") {
      updateUserXp(playerId, 100)
      updateUserXp(opponent.id, 20)
      saveGameHistory(playerId, opponent.id, "win", 100)
      saveGameHistory(opponent.id, playerId, "loss", 20)
    } else if (playerId !== "anonymous" && opponent.id === "AI") {
      updateUserXp(playerId, 100)
      saveGameHistory(playerId, "AI", "win", 100)
    }
  }

  if (!gameOver && opponent.id === "AI") {
    setTimeout(() => aiFireShot(gameId), 1000)
  }

  return { shooter: playerId, x, y, hit, sunk, gameOver }
}

const aiFireShot = (gameId: string) => {
  const game = games.get(gameId)
  if (!game || game.status !== "playing" || game.currentTurn !== "AI") return

  const player = game.player1
  if (!player) return

  let x: number, y: number
  let validShot = false

  do {
    x = Math.floor(Math.random() * GRID_SIZE)
    y = Math.floor(Math.random() * GRID_SIZE)
    validShot = validateShot(x, y, player.grid)
  } while (!validShot)

  const { hit, sunk } = processHit(x, y, player.grid, player.ships)

  const gameOver = player.ships.every((ship) => ship.isSunk)
  if (!gameOver) {
    game.currentTurn = player.id
  } else {
    game.status = "finished"
    game.winner = "AI"
    if (player.id !== "anonymous") {
      updateUserXp(player.id, 20)
      saveGameHistory(player.id, "AI", "loss", 20)
      saveGameHistory("AI", player.id, "win", 0)
    }
  }

  io.to(gameId).emit("shotResult", { shooter: "AI", x, y, hit, sunk, gameOver })
  console.log("Serialized gameUpdated payload:", JSON.stringify(game, null, 2))
  io.to(gameId).emit("gameUpdated", game)
}

const placeAIShips = (player: Player) => {
  SHIPS.forEach((shipSpec) => {
    let placed = false
    while (!placed) {
      const isHorizontal = Math.random() > 0.5
      const startX = Math.floor(Math.random() * GRID_SIZE)
      const startY = Math.floor(Math.random() * GRID_SIZE)
      const coordinates: Coordinate[] = []

      let valid = true
      for (let i = 0; i < shipSpec.size; i++) {
        const x = isHorizontal ? startX + i : startX
        const y = isHorizontal ? startY : startY + i
        if (x >= GRID_SIZE || y >= GRID_SIZE || player.grid[y][x] !== "empty") {
          valid = false
          break
        }
        coordinates.push({ x, y })
      }

      if (valid) {
        const ship: ShipType = {
          name: shipSpec.name,
          size: shipSpec.size,
          coordinates,
          hits: 0,
          isSunk: false,
          isHorizontal,
          placed: true,
        }
        player.ships.push(ship)
        coordinates.forEach(({ x, y }) => {
          player.grid[y][x] = "ship"
        })
        placed = true
      }
    }
  })
}

export const removePlayerFromGame = (
  gameId: string,
  playerId: string
): GameType | null => {
  const game = games.get(gameId)
  if (!game) return null

  console.log("Removing player from game:", {
    gameId,
    playerId,
    player1: game.player1?.id,
    player2: game.player2?.id,
  })

  if (game.player1?.id === playerId) {
    game.player1 = null
  } else if (game.player2?.id === playerId) {
    game.player2 = null
  } else {
    return game
  }

  if (game.status === "setup" && (!game.player1 || !game.player2)) {
    console.log("Game in setup phase, keeping alive:", {
      gameId,
      player1: game.player1?.id,
      player2: game.player2?.id,
    })
    return game
  }

  if (!game.player1 && !game.player2) {
    console.log("Deleting game due to no players or AI game:", gameId)
    if (game.joinCode) joinCodes.delete(game.joinCode)
    games.delete(gameId)
    return null
  }

  if (game.status === "playing") {
    game.status = "finished"
    game.winner = game.player1 ? game.player1.id : game.player2!.id
  }

  return game
}

export { games, GameType, joinCodes }
