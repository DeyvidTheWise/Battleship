// server/src/sockets/socketManager.ts
import { Server, Socket } from "socket.io"
import {
  createGame,
  placeShip,
  fireShot,
  joinGame,
  games,
} from "../services/gameService"
import {
  saveMessage,
  getDirectMessages,
  getGameMessages,
} from "../services/chatService"
import { getUserById } from "../services/userService"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export let io: Server

export const socketHandler = (server: Server) => {
  io = server
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      // Allow anonymous users for single-player mode
      socket.data.userId = "anonymous"
      return next()
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      socket.data.userId = decoded.id
      next()
    } catch (error) {
      return next(new Error("Authentication error: Invalid token"))
    }
  })

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.data.userId}`)

    socket.on("createGame", (isSinglePlayer: boolean, userId: string) => {
      console.log("createGame event received:", { isSinglePlayer, userId })
      try {
        const game = createGame(userId, isSinglePlayer)
        socket.join(game.id)
        console.log("Emitting gameCreated:", game)
        socket.emit("gameCreated", game)
        io.emit("gameListUpdate", Array.from(games.keys()))
      } catch (error) {
        console.error("Error creating game:", error)
        socket.emit("error", (error as Error).message)
      }
    })

    socket.on("joinGame", (gameId: string, userId: string) => {
      try {
        const game = joinGame(gameId, userId)
        socket.join(gameId)
        io.to(gameId).emit("gameUpdated", game)
        io.emit("gameListUpdate", Array.from(games.keys()))
      } catch (error) {
        socket.emit("error", (error as Error).message)
      }
    })

    socket.on("spectateGame", (gameId: string) => {
      const game = games.get(gameId)
      if (!game) {
        socket.emit("error", "Game not found")
        return
      }
      socket.join(gameId)
      socket.emit("gameUpdated", game)
    })

    socket.on(
      "placeShip",
      ({
        gameId,
        shipName,
        coordinates,
        isHorizontal,
      }: {
        gameId: string
        shipName: string
        coordinates: { x: number; y: number }[]
        isHorizontal: boolean
      }) => {
        try {
          placeShip(
            gameId,
            socket.data.userId,
            shipName,
            coordinates,
            isHorizontal
          )
          const game = games.get(gameId)
          io.to(gameId).emit("gameUpdated", game)
        } catch (error) {
          socket.emit("error", (error as Error).message)
        }
      }
    )

    socket.on(
      "fireShot",
      ({ gameId, x, y }: { gameId: string; x: number; y: number }) => {
        console.log("fireShot event received:", {
          gameId,
          x,
          y,
          userId: socket.data.userId,
        })
        try {
          const result = fireShot(gameId, socket.data.userId, x, y)
          console.log("Shot result:", result)
          io.to(gameId).emit("shotResult", {
            ...result,
            shooter: socket.data.userId,
            x,
            y,
          })
          const game = games.get(gameId)
          io.to(gameId).emit("gameUpdated", game)
        } catch (error) {
          console.error("Error firing shot:", error)
          socket.emit("error", (error as Error).message)
        }
      }
    )

    socket.on(
      "gameFinished",
      ({
        gameId,
        winner,
        userId,
      }: {
        gameId: string
        winner: string
        userId: string
      }) => {
        // This event is only emitted for logged-in users
        // Results are already saved in gameService.ts for logged-in users
        console.log(
          `Game ${gameId} finished. Winner: ${winner}, User: ${userId}`
        )
      }
    )

    socket.on("getGameList", () => {
      socket.emit("gameListUpdate", Array.from(games.keys()))
    })

    socket.on(
      "sendMessage",
      async ({
        gameId,
        receiverId,
        message,
      }: {
        gameId?: string
        receiverId?: string
        message: string
      }) => {
        try {
          await saveMessage(
            socket.data.userId,
            receiverId || null,
            gameId || null,
            message
          )
          const sender = await getUserById(socket.data.userId)
          const messageData = {
            sender_id: socket.data.userId,
            firstname: sender.firstname,
            lastname: sender.lastname,
            message,
            sent_at: new Date().toISOString(),
          }

          if (gameId) {
            io.to(gameId).emit("gameMessage", messageData)
          } else if (receiverId) {
            socket.to(receiverId).emit("directMessage", messageData)
            socket.emit("directMessage", messageData)
          }
        } catch (error) {
          socket.emit("error", (error as Error).message)
        }
      }
    )

    socket.on("getGameMessages", async (gameId: string) => {
      try {
        const messages = await getGameMessages(gameId)
        socket.emit("gameMessages", messages)
      } catch (error) {
        socket.emit("error", (error as Error).message)
      }
    })

    socket.on("getDirectMessages", async (friendId: string) => {
      try {
        const messages = await getDirectMessages(socket.data.userId, friendId)
        socket.emit("directMessages", messages)
      } catch (error) {
        socket.emit("error", (error as Error).message)
      }
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.userId}`)
    })
  })
}
