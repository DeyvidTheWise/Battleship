import { Server, Socket } from "socket.io"
import {
  createGame,
  joinGame,
  placeShip,
  fireShot,
  getGame,
} from "../services/gameService"

let ioInstance: Server

export const initializeSocket = (io: Server) => {
  ioInstance = io
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id)

    socket.on("createGame", (isSinglePlayer: boolean) => {
      try {
        const game = createGame(socket.id, isSinglePlayer)
        socket.join(game.id)
        socket.emit("gameCreated", game)
      } catch (error) {
        socket.emit("error", (error as Error).message)
      }
    })

    socket.on("joinGame", (gameId: string) => {
      try {
        const game = joinGame(gameId, socket.id)
        socket.join(gameId)
        io.to(gameId).emit("gameUpdated", game)
      } catch (error) {
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
      }: {
        gameId: string
        shipName: string
        coordinates: { x: number; y: number }[]
        isHorizontal: boolean
      }) => {
        try {
          placeShip(gameId, socket.id, shipName, coordinates, isHorizontal)
          const game = getGame(gameId)
          io.to(gameId).emit("gameUpdated", game)
        } catch (error) {
          socket.emit("error", (error as Error).message)
        }
      }
    )

    socket.on(
      "fireShot",
      ({ gameId, x, y }: { gameId: string; x: number; y: number }) => {
        try {
          const result = fireShot(gameId, socket.id, x, y)
          const game = getGame(gameId)
          io.to(gameId).emit("shotResult", {
            shooter: socket.id,
            x,
            y,
            ...result,
          })
          io.to(gameId).emit("gameUpdated", game)
        } catch (error) {
          socket.emit("error", (error as Error).message)
        }
      }
    )

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id)
    })
  })
}

export { ioInstance as io }
