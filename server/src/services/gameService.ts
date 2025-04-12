import { v4 as uuidv4 } from "uuid"
import { Game, Player, Ship } from "../types"
import { io } from "../sockets/socketManager"

const GRID_SIZE = 10
const SHIPS = [
  { name: "Carrier", size: 5 },
  { name: "Battleship", size: 4 },
  { name: "Cruiser", size: 3 },
  { name: "Submarine", size: 3 },
  { name: "Destroyer", size: 2 },
]

const games: Map<string, Game> = new Map()

const placeAIShips = (player: Player) => {
  SHIPS.forEach((shipSpec) => {
    let placed = false
    while (!placed) {
      const isHorizontal = Math.random() > 0.5
      const startX = Math.floor(Math.random() * GRID_SIZE)
      const startY = Math.floor(Math.random() * GRID_SIZE)
      const coordinates: { x: number; y: number }[] = []

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
        const ship: Ship = {
          name: shipSpec.name,
          size: shipSpec.size,
          coordinates,
          hits: 0,
          isSunk: false,
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

export const createGame = (
  player1Id: string,
  isSinglePlayer: boolean
): Game => {
  const player1: Player = {
    id: player1Id,
    ships: [],
    grid: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("empty")),
  }

  const game: Game = {
    id: uuidv4(),
    player1,
    player2: null,
    currentTurn: player1Id,
    status: "setup",
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

export const joinGame = (gameId: string, player2Id: string): Game => {
  const game = games.get(gameId)
  if (!game || game.player2) throw new Error("Game not found or already full")

  game.player2 = {
    id: player2Id,
    ships: [],
    grid: Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill("empty")),
  }

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

  const ship: Ship = {
    name: shipName,
    size: shipSpec.size,
    coordinates,
    hits: 0,
    isSunk: false,
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
    const ship = opponent.ships.find((s) =>
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

  const gameOver = opponent.ships.every((ship) => ship.isSunk)
  if (!gameOver) {
    game.currentTurn = opponent.id
  } else {
    game.status = "finished"
  }

  if (!gameOver && opponent.id === "AI") {
    setTimeout(() => aiFireShot(gameId), 1000) // AI shoots after 1 second
  }

  return { hit, sunk, gameOver }
}

const aiFireShot = (gameId: string) => {
  const game = games.get(gameId)
  if (!game || game.status !== "playing" || game.currentTurn !== "AI") return

  const player = game.player1
  let x: number = 0 // Initialize with a default value
  let y: number = 0 // Initialize with a default value
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
    const ship = player.ships.find((s) =>
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

  const gameOver = player.ships.every((ship) => ship.isSunk)
  if (!gameOver) {
    game.currentTurn = player.id
  } else {
    game.status = "finished"
  }

  io.to(gameId).emit("shotResult", { shooter: "AI", x, y, hit, sunk, gameOver })
  io.to(gameId).emit("gameUpdated", game)
}

export const getGame = (gameId: string): Game => {
  const game = games.get(gameId)
  if (!game) throw new Error("Game not found")
  return game
}
