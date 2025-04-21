import { Server, Socket } from "socket.io"
import jwt from "jsonwebtoken"
import {
  createGame,
  joinGame,
  findGameByJoinCode,
  placeShip,
  fireShot,
  games,
} from "../services/gameService"
import { Coordinate, GameType } from "@shared-types/game"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

// Define Socket.IO event interfaces
interface ClientToServerEvents {
  createGame: (isSinglePlayer: boolean, playerId: string) => void
  joinGame: (gameId: string, userId: string) => void
  joinGameByCode: (joinCode: string, userId: string) => void
  placeShip: (data: {
    gameId: string
    shipName: string
    coordinates: Coordinate[]
    isHorizontal: boolean
    playerId: string
  }) => void
  fireShot: (data: {
    gameId: string
    x: number
    y: number
    playerId: string
  }) => void
  fetchGameState: (gameId: string) => void
  spectateGame: (gameId: string) => void
  playerReady: (gameId: string, playerId: string) => void
}

interface ServerToClientEvents {
  gameUpdated: (game: GameType) => void
  shotResult: (result: {
    shooter: string
    x: number
    y: number
    hit: boolean
    sunk: boolean
    gameOver: boolean
  }) => void
  gameState: (game: GameType) => void
  navigateToGame: (gameId: string) => void
  error: (message: string) => void
  gameListUpdate: (
    gameList: {
      id: string
      joinCode: string | null
      playerCount: number
      playerNames: string[]
    }[]
  ) => void
}

export const io = new Server<ClientToServerEvents, ServerToClientEvents>({
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

io.use((socket: Socket, next) => {
  const token = socket.handshake.auth.token
  if (!token) {
    console.log("No token provided, allowing anonymous user")
    socket.data.userId = "anonymous"
    return next()
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    socket.data.userId = decoded.id
    console.log("Authenticated user:", socket.data.userId)
    next()
  } catch (error: any) {
    console.error("Authentication error:", {
      error: error.message,
      stack: error.stack,
      tokenExpired: error.name === "TokenExpiredError",
      expiredAt: error.expiredAt,
    })
    if (error instanceof Error && error.name === "TokenExpiredError") {
      socket.emit("error", "jwt expired")
      socket.data.userId = "anonymous"
      next()
    } else {
      socket.emit("error", "invalid token")
      socket.data.userId = "anonymous"
      next()
    }
  }
})

io.on("connection", (socket: Socket) => {
  console.log(`User connected: ${socket.data.userId}`)

  socket.on("createGame", (isSinglePlayer: boolean, playerId: string) => {
    console.log("createGame event received:", { isSinglePlayer, playerId })
    try {
      if (socket.data.userId === "anonymous") {
        throw new Error("Anonymous users cannot create games. Please log in.")
      }
      const game = createGame(playerId, isSinglePlayer)
      socket.join(game.id)
      console.log("Player created and joined room:", {
        gameId: game.id,
        playerId,
        rooms: Array.from(socket.rooms),
      })
      io.to(game.id).emit("gameUpdated", game)
      updateGameList()
    } catch (error) {
      console.error("Error creating game:", error)
      socket.emit("error", (error as Error).message)
    }
  })

  socket.on("joinGame", (gameId: string, userId: string) => {
    console.log("joinGame event received:", {
      gameId,
      userId,
      socketUserId: socket.data.userId,
    })
    try {
      if (socket.data.userId === "anonymous") {
        throw new Error("Anonymous users cannot join games. Please log in.")
      }
      const game = joinGame(gameId, userId)
      socket.join(gameId)
      console.log("Player joined room:", {
        gameId,
        userId,
        rooms: Array.from(socket.rooms),
      })

      const roomMembers = Array.from(io.sockets.adapter.rooms.get(gameId) || [])
      console.log("[DEBUG] Current room members after join:", {
        gameId,
        roomMembers,
      })

      io.to(gameId).emit("gameUpdated", game)
      updateGameList()
    } catch (error) {
      console.error("Error joining game:", error)
      socket.emit("error", (error as Error).message)
    }
  })

  socket.on("joinGameByCode", (joinCode: string, userId: string) => {
    console.log("joinGameByCode event received:", {
      joinCode,
      userId,
      socketUserId: socket.data.userId,
    })
    try {
      if (socket.data.userId === "anonymous") {
        throw new Error("Anonymous users cannot join games. Please log in.")
      }
      const game = findGameByJoinCode(joinCode)
      if (!game) {
        throw new Error("Invalid join code")
      }
      const updatedGame = joinGame(game.id, userId)
      socket.join(game.id)
      console.log("Player joined room via join code:", {
        gameId: game.id,
        userId,
        rooms: Array.from(socket.rooms),
      })

      const roomMembers = Array.from(
        io.sockets.adapter.rooms.get(game.id) || []
      )
      console.log("[DEBUG] Current room members after join:", {
        gameId: game.id,
        roomMembers,
      })

      io.to(game.id).emit("gameUpdated", updatedGame)
      updateGameList()
      socket.emit("navigateToGame", game.id)
    } catch (error) {
      console.error("Error joining game by code:", error)
      socket.emit("error", (error as Error).message)
    }
  })

  socket.on(
    "placeShip",
    ({
      gameId,
      shipName,
      coordinates,
      isHorizontal,
      playerId,
    }: {
      gameId: string
      shipName: string
      coordinates: Coordinate[]
      isHorizontal: boolean
      playerId: string
    }) => {
      console.log("placeShip event received:", {
        gameId,
        shipName,
        coordinates,
        isHorizontal,
        playerId,
      })
      try {
        placeShip(gameId, playerId, shipName, coordinates, isHorizontal)
        const roomMembers = Array.from(
          io.sockets.adapter.rooms.get(gameId) || []
        )
        console.log("Emitting gameUpdated to room members:", {
          gameId,
          roomMembers,
        })
      } catch (error) {
        console.error("Error placing ship:", error)
        socket.emit("error", (error as Error).message)
      }
    }
  )

  socket.on(
    "fireShot",
    ({
      gameId,
      x,
      y,
      playerId,
    }: {
      gameId: string
      x: number
      y: number
      playerId: string
    }) => {
      console.log("fireShot event received:", { gameId, x, y, playerId })
      try {
        const result = fireShot(gameId, x, y, playerId)
        io.to(gameId).emit("shotResult", result)
      } catch (error) {
        console.error("Error firing shot:", error)
        socket.emit("error", (error as Error).message)
      }
    }
  )

  socket.on("fetchGameState", (gameId: string) => {
    console.log("fetchGameState event received:", {
      gameId,
      userId: socket.data.userId,
    })
    try {
      const game = games.get(gameId)
      if (!game) {
        throw new Error("Game not found")
      }
      socket.emit("gameState", game)
    } catch (error) {
      console.error("Error fetching game state:", error)
      socket.emit("error", (error as Error).message)
    }
  })

  socket.on("spectateGame", (gameId: string) => {
    console.log("spectateGame event received:", {
      gameId,
      userId: socket.data.userId,
    })
    try {
      const game = games.get(gameId)
      if (!game) {
        throw new Error("Game not found")
      }
      socket.join(gameId)
      console.log("Spectator joined room:", {
        gameId,
        userId: socket.data.userId,
        rooms: Array.from(socket.rooms),
      })
      socket.emit("gameState", game)
    } catch (error) {
      console.error("Error spectating game:", error)
      socket.emit("error", (error as Error).message)
    }
  })

  socket.on("playerReady", (gameId: string, playerId: string) => {
    console.log("playerReady event received:", { gameId, playerId })
    try {
      const game = games.get(gameId)
      if (!game) throw new Error("Game not found")
      // Update game state if needed (e.g., check if both players are ready)
      io.to(gameId).emit("gameUpdated", game)
    } catch (error) {
      console.error("Error handling playerReady:", error)
      socket.emit("error", (error as Error).message)
    }
  })

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.data.userId}`)
    updateGameList()
  })
})

function updateGameList() {
  const gameList = Array.from(games.entries()).map(([id, game]) => ({
    id,
    joinCode: game.joinCode,
    playerCount: (game.player1 ? 1 : 0) + (game.player2 ? 1 : 0),
    playerNames: [
      game.player1 ? `${game.player1.id}` : null,
      game.player2 ? `${game.player2.id}` : null,
    ].filter((name) => name !== null) as string[],
  }))
  console.log("Sending gameListUpdate:", gameList)
  io.emit("gameListUpdate", gameList)
}
