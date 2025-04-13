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

const games = new Map<string, GameType>()

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
  const player1: Player = {
    id: player1Id,
    ships: [],
    grid: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("empty")),
  }

  const game: GameType = {
    id: uuidv4(),
    player1,
    player2: null,
    currentTurn: player1Id,
    status: "setup",
    winner: null,
  }

  if (isSinglePlayer) {
    const aiPlayer: Player = {
      id: "AI",
      ships: [],
      grid: Array(GRID_SIZE)
        .fill(null)
        .map(() => Array(GRID_SIZE).fill("empty")),
    }
    placeAIShips(aiPlayer)
    game.player2 = aiPlayer
  }

  games.set(game.id, game)
  return game
}

export const joinGame = (gameId: string, player2Id: string): GameType => {
  const game = games.get(gameId)
  if (!game) throw new Error("Game not found")
  if (game.player2) throw new Error("Game already has two players")
  if (game.player1.id === player2Id)
    throw new Error("You are already in this game")

  const player2: Player = {
    id: player2Id,
    ships: [],
    grid: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("empty")),
  }
  game.player2 = player2
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

  const player = game.player1.id === playerId ? game.player1 : game.player2
  if (!player) throw new Error("Player not found")

  const shipSpec = SHIPS.find((s) => s.name === shipName)
  if (!shipSpec) throw new Error("Invalid ship name")

  if (coordinates.length !== shipSpec.size) throw new Error("Invalid ship size")
  const [startX, startY] = [coordinates[0].x, coordinates[0].y]
  for (let i = 0; i < shipSpec.size; i++) {
    const x = isHorizontal ? startX + i : startX
    const y = isHorizontal ? startY : startY + i
    if (x >= GRID_SIZE || y >= GRID_SIZE || player.grid[y][x] !== "empty") {
      throw new Error("Invalid ship placement")
    }
    coordinates[i] = { x, y }
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

  if (
    game.player1.ships.length === SHIPS.length &&
    (!game.player2 || game.player2.ships.length === SHIPS.length)
  ) {
    game.status = "playing"
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

  const opponent = game.player1.id === playerId ? game.player2 : game.player1
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

export { games }
