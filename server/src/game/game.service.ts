import { getConnection } from "../utils/db"
import { Game, GameState, Ship } from "@shared-types"
import { v4 as uuidv4 } from "uuid"
import { getIO } from "../utils/socket"
import { SHIP_SIZES, isValidShip } from "../utils/constants"

export const createGame = async (
  mode: Game["mode"],
  player1_id: string,
  player2_id?: string,
  difficulty?: string
): Promise<Game> => {
  const game: Game = {
    game_id: uuidv4(),
    mode,
    player1_id,
    player2_id,
    status: "setup",
    created_at: new Date(),
  }

  const connection = await getConnection()
  await connection.execute(
    "INSERT INTO Games (game_id, mode, player1_id, player2_id, status, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      game.game_id,
      game.mode,
      game.player1_id,
      game.player2_id,
      game.status,
      game.created_at,
    ]
  )

  const initialState: GameState = {
    state_id: uuidv4(),
    game_id: game.game_id,
    player_id: player1_id,
    grid: {},
    shots: [],
    remaining_ships: Object.keys(SHIP_SIZES).reduce(
      (acc, ship) => ({ ...acc, [ship]: true }),
      {}
    ),
    timer_state: { setup_timer: 60, shot_timer: 30 },
  }

  await connection.execute(
    "INSERT INTO GameState (state_id, game_id, player_id, grid, shots, remaining_ships, timer_state) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      initialState.state_id,
      initialState.game_id,
      initialState.player_id,
      JSON.stringify(initialState.grid),
      JSON.stringify(initialState.shots),
      JSON.stringify(initialState.remaining_ships),
      JSON.stringify(initialState.timer_state),
    ]
  )

  if (player2_id) {
    const player2State: GameState = {
      ...initialState,
      state_id: uuidv4(),
      player_id: player2_id,
    }
    await connection.execute(
      "INSERT INTO GameState (state_id, game_id, player_id, grid, shots, remaining_ships, timer_state) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        player2State.state_id,
        player2State.game_id,
        player2State.player_id,
        JSON.stringify(player2State.grid),
        JSON.stringify(player2State.shots),
        JSON.stringify(player2State.remaining_ships),
        JSON.stringify(player2State.timer_state),
      ]
    )
  }

  await connection.end()

  const io = getIO()
  io.emit("game-update", { game_id: game.game_id, status: game.status })

  // Start setup timer
  let setupTimer = 60
  const timerInterval = setInterval(() => {
    setupTimer--
    io.emit("timer-update", { game_id: game.game_id, setup_timer: setupTimer })
    if (setupTimer <= 0) {
      clearInterval(timerInterval)
      autoPlaceShips(game.game_id)
    }
  }, 1000)

  return game
}

const autoPlaceShips = async (game_id: string) => {
  const connection = await getConnection()
  const [states] = await connection.execute(
    "SELECT * FROM GameState WHERE game_id = ?",
    [game_id]
  )
  const gameStates = states as GameState[]

  for (const state of gameStates) {
    if (Object.keys(state.grid).length === 0) {
      const grid: {
        [ship: string]: {
          position: string
          orientation: "horizontal" | "vertical"
        }
      } = {}
      for (const ship of Object.keys(SHIP_SIZES)) {
        grid[ship] = { position: "A1", orientation: "horizontal" } // Simplified auto-placement
      }
      await connection.execute(
        "UPDATE GameState SET grid = ? WHERE state_id = ?",
        [JSON.stringify(grid), state.state_id]
      )
    }
  }

  await connection.execute(
    'UPDATE Games SET status = "active" WHERE game_id = ?',
    [game_id]
  )
  await connection.end()

  const io = getIO()
  io.emit("game-update", { game_id, status: "active" })
}

export const placeShips = async (
  game_id: string,
  user_id: string,
  ships: Ship[]
): Promise<void> => {
  const connection = await getConnection()
  const [states] = await connection.execute(
    "SELECT * FROM GameState WHERE game_id = ? AND player_id = ?",
    [game_id, user_id]
  )
  const state = (states as GameState[])[0]

  const grid: {
    [ship: string]: { position: string; orientation: "horizontal" | "vertical" }
  } = {}
  for (const ship of ships) {
    if (!isValidShip(ship.name)) {
      throw new Error(`Invalid ship type: ${ship.name}`)
    }
    grid[ship.name] = { position: ship.position, orientation: ship.orientation }
  }

  await connection.execute("UPDATE GameState SET grid = ? WHERE state_id = ?", [
    JSON.stringify(grid),
    state.state_id,
  ])

  const [allStates] = await connection.execute(
    "SELECT * FROM GameState WHERE game_id = ?",
    [game_id]
  )
  const allReady = (allStates as GameState[]).every(
    (s) => Object.keys(s.grid).length > 0
  )
  if (allReady) {
    await connection.execute(
      'UPDATE Games SET status = "active" WHERE game_id = ?',
      [game_id]
    )
    const io = getIO()
    io.emit("game-update", { game_id, status: "active" })
  }

  if (allReady) {
    await connection.execute(
      'UPDATE Games SET status = "active" WHERE game_id = ?',
      [game_id]
    )
    const io = getIO()
    io.emit("game-update", { game_id, status: "active" })
  }

  await connection.end()
}

export const fireShot = async (
  game_id: string,
  user_id: string,
  cell: string
): Promise<{ result: "hit" | "miss"; gameState: GameState }> => {
  const connection = await getConnection()
  const [gameRows] = await connection.execute(
    "SELECT * FROM Games WHERE game_id = ?",
    [game_id]
  )
  const game = (gameRows as Game[])[0]

  const [states] = await connection.execute(
    "SELECT * FROM GameState WHERE game_id = ?",
    [game_id]
  )
  const gameStates = states as GameState[]
  const playerState = gameStates.find((s) => s.player_id === user_id)
  const opponentState = gameStates.find((s) => s.player_id !== user_id)

  if (!playerState || !opponentState) throw new Error("Game state not found")

  // Parse the grid fields (stored as JSON strings in the database)
  playerState.grid =
    typeof playerState.grid === "string"
      ? JSON.parse(playerState.grid)
      : playerState.grid
  opponentState.grid =
    typeof opponentState.grid === "string"
      ? JSON.parse(opponentState.grid)
      : opponentState.grid
  playerState.shots =
    typeof playerState.shots === "string"
      ? JSON.parse(playerState.shots)
      : playerState.shots
  opponentState.shots =
    typeof opponentState.shots === "string"
      ? JSON.parse(opponentState.shots)
      : opponentState.shots
  playerState.remaining_ships =
    typeof playerState.remaining_ships === "string"
      ? JSON.parse(playerState.remaining_ships)
      : playerState.remaining_ships
  opponentState.remaining_ships =
    typeof opponentState.remaining_ships === "string"
      ? JSON.parse(opponentState.remaining_ships)
      : opponentState.remaining_ships
  playerState.timer_state =
    typeof playerState.timer_state === "string"
      ? JSON.parse(playerState.timer_state)
      : playerState.timer_state
  opponentState.timer_state =
    typeof opponentState.timer_state === "string"
      ? JSON.parse(opponentState.timer_state)
      : opponentState.timer_state

  let hit = false
  for (const [ship, { position, orientation }] of Object.entries(
    opponentState.grid
  )) {
    if (!isValidShip(ship)) {
      console.warn(`Invalid ship type: ${ship}, skipping...`)
      continue
    }
    const size = SHIP_SIZES[ship]
    const [col, row] = position.split("")
    const colIndex = col.charCodeAt(0) - "A".charCodeAt(0)
    const rowIndex = parseInt(row) - 1

    for (let i = 0; i < size; i++) {
      const targetCell =
        orientation === "horizontal"
          ? `${String.fromCharCode("A".charCodeAt(0) + colIndex + i)}${
              rowIndex + 1
            }`
          : `${col}${parseInt(row) + i}`
      if (targetCell === cell) {
        hit = true
        break
      }
    }
    if (hit) break
  }

  const result = hit ? "hit" : "miss"
  playerState.shots.push({ cell, result })

  if (hit) {
    const shipHit = Object.keys(opponentState.remaining_ships).find((ship) => {
      if (!isValidShip(ship)) return false
      const { position, orientation } = opponentState.grid[ship]
      const size = SHIP_SIZES[ship]
      const [col, row] = position.split("")
      const colIndex = col.charCodeAt(0) - "A".charCodeAt(0)
      const rowIndex = parseInt(row) - 1

      for (let i = 0; i < size; i++) {
        const targetCell =
          orientation === "horizontal"
            ? `${String.fromCharCode("A".charCodeAt(0) + colIndex + i)}${
                rowIndex + 1
              }`
            : `${col}${parseInt(row) + i}`
        if (targetCell === cell) return true
      }
      return false
    })

    if (shipHit && isValidShip(shipHit)) {
      const shipCells = playerState.shots.filter((s) => {
        const { position, orientation } = opponentState.grid[shipHit]
        const size = SHIP_SIZES[shipHit]
        const [col, row] = position.split("")
        const colIndex = col.charCodeAt(0) - "A".charCodeAt(0)
        const rowIndex = parseInt(row) - 1

        const cells = []
        for (let i = 0; i < size; i++) {
          cells.push(
            orientation === "horizontal"
              ? `${String.fromCharCode("A".charCodeAt(0) + colIndex + i)}${
                  rowIndex + 1
                }`
              : `${col}${parseInt(row) + i}`
          )
        }
        return cells.includes(s.cell) && s.result === "hit"
      })

      if (shipCells.length === SHIP_SIZES[shipHit]) {
        opponentState.remaining_ships[shipHit] = false
      }
    }
  }

  const gameOver = Object.values(opponentState.remaining_ships).every((s) => !s)
  if (gameOver) {
    await connection.execute(
      'UPDATE Games SET status = "finished", winner_id = ? WHERE game_id = ?',
      [user_id, game_id]
    )
    const io = getIO()
    io.emit("game-end", { game_id, winner: user_id })
  }

  await connection.execute(
    "UPDATE GameState SET shots = ?, remaining_ships = ? WHERE state_id = ?",
    [
      JSON.stringify(playerState.shots),
      JSON.stringify(opponentState.remaining_ships),
      playerState.state_id,
    ]
  )

  await connection.end()

  const io = getIO()
  io.emit("game-update", { game_id, shot: { cell, result } })

  return { result, gameState: playerState }
}

export const getGameState = async (
  game_id: string,
  user_id: string
): Promise<GameState> => {
  const connection = await getConnection()
  const [states] = await connection.execute(
    "SELECT * FROM GameState WHERE game_id = ? AND player_id = ?",
    [game_id, user_id]
  )
  await connection.end()
  return (states as GameState[])[0]
}
