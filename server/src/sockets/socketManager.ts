import { Server, Socket } from "socket.io"
import {
  createGame,
  placeShip,
  fireShot,
  joinGame,
  games,
  findGameByJoinCode,
  removePlayerFromGame,
} from "../services/gameService"
import {
  saveMessage,
  getDirectMessages,
  getGameMessages,
} from "../services/chatService"
import { getUserById } from "../services/userService"
import jwt from "jsonwebtoken"
import { Coordinate } from "@shared-types/game" // Added import

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export let io: Server

const updateGameList = () => {
  io.emit(
    "gameListUpdate",
    Array.from(games.values()).map((g) => ({
      id: g.id,
      joinCode: g.joinCode,
      playerCount: (g.player1 ? 1 : 0) + (g.player2 ? 1 : 0),
      playerNames: [g.player1?.id, g.player2?.id]
        .filter((id): id is string => typeof id === "string" && id !== "AI")
        .filter(Boolean),
    }))
  )
}

export const socketHandler = (server: Server) => {
  io = server
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
    } catch (error) {
      console.error("Authentication error:", error)
      socket.data.userId = "anonymous"
      next()
    }
  })

  // Periodic game list update every 5 seconds
  setInterval(() => {
    updateGameList()
  }, 5000)

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.data.userId}`)

    socket.on("createGame", (isSinglePlayer: boolean, userId: string) => {
      console.log("createGame event received:", {
        isSinglePlayer,
        userId,
        socketUserId: socket.data.userId,
      })
      try {
        const game = createGame(userId, isSinglePlayer)
        socket.join(game.id)
        console.log("Emitting gameCreated:", game)
        socket.emit("gameCreated", game)
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
        const game = joinGame(gameId, userId)
        socket.join(gameId)
        console.log("Emitting gameUpdated:", game)
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
        const game = findGameByJoinCode(joinCode)
        if (!game) {
          throw new Error("Game not found for this join code")
        }
        const updatedGame = joinGame(game.id, userId)
        socket.join(game.id)
        console.log("Emitting gameUpdated:", updatedGame)
        io.to(game.id).emit("gameUpdated", updatedGame)
        updateGameList()
      } catch (error) {
        console.error("Error joining game by code:", error)
        socket.emit("error", (error as Error).message)
      }
    })

    socket.on("spectateGame", (gameId: string) => {
      console.log("spectateGame event received:", {
        gameId,
        userId: socket.data.userId,
      })
      const game = games.get(gameId)
      if (!game) {
        socket.emit("error", "Game not found")
        return
      }
      socket.join(gameId)
      socket.emit("gameUpdated", game)
    })

    socket.on("getGameList", () => {
      console.log("getGameList event received")
      updateGameList()
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
        coordinates: Coordinate[]
        isHorizontal: boolean
      }) => {
        console.log("placeShip event received:", {
          gameId,
          shipName,
          coordinates,
          isHorizontal,
          userId: socket.data.userId,
        })
        try {
          placeShip(
            gameId,
            socket.data.userId,
            shipName,
            coordinates,
            isHorizontal
          )
        } catch (error) {
          console.error("Error placing ship:", error)
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
          const game = removePlayerFromGame(gameId, socket.data.userId)
          if (game) {
            io.to(gameId).emit("gameUpdated", game)
            updateGameList()
          }
        }
      }
    )

    socket.on("timeout", (gameId: string, userId: string) => {
      console.log("timeout event received:", { gameId, userId })
      const game = games.get(gameId)
      if (game && game.status === "playing" && game.currentTurn === userId) {
        game.status = "finished"
        game.winner =
          game.player1?.id === userId
            ? game.player2?.id ?? null
            : game.player1?.id ?? null
        io.to(gameId).emit("gameUpdated", game)
        updateGameList()
      }
    })

    socket.on(
      "sendMessage",
      ({ gameId, content }: { gameId: string; content: string }) => {
        console.log("sendMessage event received:", {
          gameId,
          content,
          userId: socket.data.userId,
        })
        const message = saveMessage(
          socket.data.userId,
          gameId,
          content,
          Date.now()
        )
        io.to(gameId).emit("newMessage", message)
      }
    )

    socket.on("getGameMessages", (gameId: string) => {
      console.log("getGameMessages event received:", {
        gameId,
        userId: socket.data.userId,
      })
      const messages = getGameMessages(gameId)
      socket.emit("gameMessages", messages)
    })

    socket.on("getDirectMessages", (receiverId: string) => {
      console.log("getDirectMessages event received:", {
        receiverId,
        userId: socket.data.userId,
      })
      const messages = getDirectMessages(socket.data.userId, receiverId)
      socket.emit("directMessages", messages)
    })

    socket.on("getUserInfo", (userId: string) => {
      console.log("getUserInfo event received:", {
        userId,
        requesterId: socket.data.userId,
      })
      const userInfo = getUserById(userId)
      socket.emit("userInfo", userInfo)
    })

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.data.userId}`)
      const rooms = Array.from(socket.rooms).filter(
        (room) => room !== socket.id
      )
      rooms.forEach((gameId) => {
        const game = removePlayerFromGame(gameId, socket.data.userId)
        if (game) {
          io.to(gameId).emit("gameUpdated", game)
          updateGameList()
        }
      })
    })
  })
}
