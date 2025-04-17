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
    io.to(game.id).emit("gameUpdated", game)
  }

  console.log(
    "Player 1 grid initialization:",
    player1.grid.map((row) => row.join(","))
  )
  if (game.player2) {
    console.log(
      "Player 2 grid initialization:",
      game.player2.grid.map((row) => row.join(","))
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
  if (!game) throw new Error("Game not found")
  if (game.player2) throw new Error("Game already has two players")
  if (game.player1?.id === player2Id)
    throw new Error("You are already in this game")

  const player2: Player = {
    id: player2Id,
    ships: [],
    grid: Array.from({ length: GRID_SIZE }, () =>
      Array.from({ length: GRID_SIZE }, () => "empty")
    ),
  }
  game.player2 = player2
  console.log("Game after joining:", game)
  return game
}

export const placeShip = (
  gameId: string,
  playerId: string,
  shipName: string,
  coordinates: { x: number; y: number }[],
  isHorizontal: boolean
): void => {
  const game = games.get(gameId)
  if (!game) throw new Error("Game not found")

  const player = game.player1?.id === playerId ? game.player1 : game.player2
  if (!player) throw new Error("Player not found")

  console.log("Placing ship for player:", player.id, "Player ID:", playerId)
  console.log("Game state:", {
    player1Id: game.player1?.id,
    player2Id: game.player2?.id,
  })

  const shipSpec = SHIPS.find((s) => s.name === shipName)
  if (!shipSpec) throw new Error("Invalid ship name")

  if (coordinates.length !== shipSpec.size) throw new Error("Invalid ship size")

  console.log("Attempting to place ship:", {
    shipName,
    coordinates,
    isHorizontal,
  })
  console.log(
    "Server grid state before placement (player:",
    player.id,
    "):",
    player.grid.map((row) => row.join(","))
  )

  for (const { x, y } of coordinates) {
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) {
      console.log("Invalid coordinates:", { x, y })
      throw new Error("Invalid ship placement: Coordinates out of bounds")
    }
    if (player.grid[y][x] !== "empty") {
      console.log("Position already occupied:", {
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
    "Server grid state after placement (player:",
    player.id,
    "):",
    player.grid.map((row) => row.join(","))
  )

  if (
    game.player1?.ships.length === SHIPS.length &&
    (!game.player2 || game.player2.ships.length === SHIPS.length)
  ) {
    game.status = "playing"
  }

  io.to(gameId).emit("gameUpdated", game)
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

export const fireShot = (
  gameId: string,
  playerId: string,
  x: number,
  y: number
): { hit: boolean; sunk: boolean; gameOver: boolean } => {
  const game = games.get(gameId)
  if (!game || game.status !== "playing")
    throw new Error("Game not found or not in progress")
  if (game.currentTurn !== playerId) throw new Error("Not your turn")

  const opponent = game.player1?.id === playerId ? game.player2 : game.player1
  if (!opponent) throw new Error("Opponent not found")

  if (
    x < 0 ||
    x >= GRID_SIZE ||
    y < 0 ||
    y >= GRID_SIZE ||
    opponent.grid[y][x] === "hit" ||
    opponent.grid[y][x] === "miss"
  ) {
    throw new Error("Invalid shot")
  }

  const hit = opponent.grid[y][x] === "ship"
  opponent.grid[y][x] = hit ? "hit" : "miss"

  let sunk = false
  if (hit) {
    const ship = opponent.ships.find((s: ShipType) =>
      s.coordinates.some((coord: Coordinate) => coord.x === x && coord.y === y)
    )
    if (ship) {
      ship.hits++
      if (ship.hits === ship.size) {
        ship.isSunk = true
        sunk = true
      }
    }
  }

  const gameOver = opponent.ships.every((ship: ShipType) => ship.isSunk)
  if (!gameOver) {
    game.currentTurn = opponent.id
  } else {
    game.status = "finished"
    game.winner = playerId
    // Only save XP and history for logged-in users (not 'anonymous')
    if (playerId !== "anonymous" && opponent.id !== "anonymous") {
      updateUserXp(playerId, 100)
      updateUserXp(opponent.id, 20)
      saveGameHistory(playerId, opponent.id, "win", 100)
      saveGameHistory(opponent.id, playerId, "loss", 20)
    }
  }

  if (!gameOver && opponent.id === "AI") {
    setTimeout(() => aiFireShot(gameId), 1000)
  }

  return { hit, sunk, gameOver }
}

const aiFireShot = (gameId: string) => {
  const game = games.get(gameId)
  if (!game || game.status !== "playing" || game.currentTurn !== "AI") return

  const player = game.player1
  if (!player) return // Exit if player is null

  let x: number = 0
  let y: number = 0
  let validShot = false

  while (!validShot) {
    x = Math.floor(Math.random() * GRID_SIZE)
    y = Math.floor(Math.random() * GRID_SIZE)
    if (player.grid[y][x] !== "hit" && player.grid[y][x] !== "miss") {
      validShot = true
    }
  }

  const hit = player.grid[y][x] === "ship"
  player.grid[y][x] = hit ? "hit" : "miss"

  let sunk = false
  if (hit) {
    const ship = player.ships.find((s: ShipType) =>
      s.coordinates.some((coord: Coordinate) => coord.x === x && coord.y === y)
    )
    if (ship) {
      ship.hits++
      if (ship.hits === ship.size) {
        ship.isSunk = true
        sunk = true
      }
    }
  }

  const gameOver = player.ships.every((ship: ShipType) => ship.isSunk)
  if (!gameOver) {
    game.currentTurn = player.id
  } else {
    game.status = "finished"
    game.winner = "AI"
    // Only save XP and history for logged-in users (not 'anonymous')
    if (player.id !== "anonymous") {
      updateUserXp(player.id, 20)
      saveGameHistory(player.id, "AI", "loss", 20)
      saveGameHistory("AI", player.id, "win", 0)
    }
  }

  io.to(gameId).emit("shotResult", { shooter: "AI", x, y, hit, sunk, gameOver })
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

  if (game.player1?.id === playerId) {
    game.player1 = null
  } else if (game.player2?.id === playerId) {
    game.player2 = null
  }

  const playerCount = (game.player1 ? 1 : 0) + (game.player2 ? 1 : 0)
  if (playerCount === 0 || (game.player2 && game.player2.id === "AI")) {
    // For AI games or empty games, delete immediately
    if (game.joinCode) joinCodes.delete(game.joinCode)
    games.delete(gameId)
    return null
  } else {
    // For multiplayer games, keep the game alive for 5 minutes
    setTimeout(() => {
      const updatedGame = games.get(gameId)
      if (updatedGame && !updatedGame.player1 && !updatedGame.player2) {
        if (updatedGame.joinCode) joinCodes.delete(updatedGame.joinCode)
        games.delete(gameId)
        io.emit(
          "gameListUpdate",
          Array.from(games.values()).map((g) => ({
            id: g.id,
            joinCode: g.joinCode,
            playerCount: (g.player1 ? 1 : 0) + (g.player2 ? 1 : 0),
            playerNames: [g.player1, g.player2]
              .filter((p): p is Player => p !== null)
              .map((p) => (p.id === "AI" ? "AI" : p.id)),
          }))
        )
      }
    }, 5 * 60 * 1000) // 5 minutes
    return game
  }
}

export { games }
