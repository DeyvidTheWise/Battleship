import type { Server, Socket } from "socket.io"
import { verifyToken } from "../shared/middleware/auth"
import { createMessage } from "../modules/chat/model"

interface Position {
  x: number
  y: number
}

interface ShipPosition extends Position {
  hit: boolean
}

interface Ship {
  id: string
  positions: ShipPosition[]
  sunk: boolean
}

interface Player {
  id: string
  userId: number
  username: string
  ready: boolean
  ships: Ship[]
}

interface GameState {
  id: string
  players: Player[]
  currentTurn: string
  status: "waiting" | "playing" | "finished"
  winner: string | null
  lastMoveTimestamp: number
}

interface SocketUser {
  id: string
  username: string
  userId: number
}

const activeGames = new Map<string, GameState>()
const connectedUsers = new Map<string, SocketUser>()

export const initializeSocketHandlers = (io: Server): void => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token
      if (!token) {
        return next(new Error("Authentication error: Token required"))
      }

      const decoded = await verifyToken(token)
      if (!decoded || !decoded.id) {
        return next(new Error("Authentication error: Invalid token"))
      }

      socket.data.user = {
        id: decoded.id,
        username: decoded.username,
      }

      next()
    } catch (error) {
      console.error("Socket authentication error:", error)
      next(new Error("Authentication error"))
    }
  })

  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`)

    const userId = socket.data.user?.id
    const username = socket.data.user?.username

    if (!userId || !username) {
      socket.disconnect()
      return
    }

    connectedUsers.set(socket.id, {
      id: socket.id,
      username,
      userId,
    })

    socket.on(
      "send_message",
      async (data: { receiverId: number; content: string }) => {
        try {
          const { receiverId, content } = data

          if (!userId || !receiverId || !content) {
            socket.emit("error", { message: "Invalid message data" })
            return
          }

          await createMessage(userId, receiverId, content)

          const receiverSocket = Array.from(connectedUsers.entries()).find(
            ([_, user]) => user.userId === receiverId
          )?.[0]

          if (receiverSocket) {
            io.to(receiverSocket).emit("receive_message", {
              senderId: userId,
              content,
              timestamp: new Date(),
            })
          }

          socket.emit("message_sent", { success: true, receiverId, content })
        } catch (error) {
          console.error("Error sending message:", error)
          socket.emit("error", { message: "Failed to send message" })
        }
      }
    )

    socket.on("create_game", () => {
      try {
        if (!userId || !username) {
          socket.emit("error", { message: "User not authenticated" })
          return
        }

        const gameId = `game_${Date.now()}_${Math.floor(Math.random() * 1000)}`

        const newGame: GameState = {
          id: gameId,
          players: [
            {
              id: socket.id,
              userId: userId,
              username,
              ready: false,
              ships: [],
            },
          ],
          currentTurn: "",
          status: "waiting",
          winner: null,
          lastMoveTimestamp: Date.now(),
        }

        activeGames.set(gameId, newGame)

        socket.join(gameId)
        socket.emit("game_created", { gameId, game: newGame })

        console.log(`Game created: ${gameId}`)
      } catch (error) {
        console.error("Error creating game:", error)
        socket.emit("error", { message: "Failed to create game" })
      }
    })

    socket.on("join_game", ({ gameId }: { gameId: string }) => {
      try {
        if (!userId || !username) {
          socket.emit("error", { message: "User not authenticated" })
          return
        }

        const game = activeGames.get(gameId)

        if (!game) {
          socket.emit("error", { message: "Game not found" })
          return
        }

        if (game.status !== "waiting") {
          socket.emit("error", { message: "Game already started" })
          return
        }

        if (game.players.length >= 2) {
          socket.emit("error", { message: "Game is full" })
          return
        }

        game.players.push({
          id: socket.id,
          userId: userId,
          username,
          ready: false,
          ships: [],
        })

        activeGames.set(gameId, game)

        socket.join(gameId)

        io.to(gameId).emit("player_joined", {
          gameId,
          player: { id: socket.id, username },
          game,
        })

        console.log(`Player ${username} joined game: ${gameId}`)
      } catch (error) {
        console.error("Error joining game:", error)
        socket.emit("error", { message: "Failed to join game" })
      }
    })

    socket.on(
      "player_ready",
      ({ gameId, ships }: { gameId: string; ships: Ship[] }) => {
        try {
          const game = activeGames.get(gameId)

          if (!game) {
            socket.emit("error", { message: "Game not found" })
            return
          }

          const playerIndex = game.players.findIndex((p) => p.id === socket.id)

          if (playerIndex === -1) {
            socket.emit("error", { message: "Player not in this game" })
            return
          }

          game.players[playerIndex].ships = ships
          game.players[playerIndex].ready = true

          const allReady = game.players.every((p) => p.ready)

          if (allReady && game.players.length === 2) {
            game.status = "playing"
            game.currentTurn = game.players[0].id
            game.lastMoveTimestamp = Date.now()

            io.to(gameId).emit("game_started", {
              gameId,
              game: {
                ...game,

                players: game.players.map((p) => ({
                  ...p,
                  ships:
                    p.id === socket.id
                      ? p.ships
                      : p.ships.map((ship) => ({
                          ...ship,
                          positions: ship.positions.map((pos) => ({
                            ...pos,
                            x: -1,
                            y: -1,
                          })),
                        })),
                })),
              },
            })
          } else {
            io.to(gameId).emit("player_ready", {
              gameId,
              playerId: socket.id,
              allReady,
            })
          }

          activeGames.set(gameId, game)
        } catch (error) {
          console.error("Error setting player ready:", error)
          socket.emit("error", { message: "Failed to set ready status" })
        }
      }
    )

    socket.on(
      "make_move",
      ({ gameId, position }: { gameId: string; position: Position }) => {
        try {
          const game = activeGames.get(gameId)

          if (!game) {
            socket.emit("error", { message: "Game not found" })
            return
          }

          if (game.status !== "playing") {
            socket.emit("error", { message: "Game not in progress" })
            return
          }

          if (game.currentTurn !== socket.id) {
            socket.emit("error", { message: "Not your turn" })
            return
          }

          const opponent = game.players.find((p) => p.id !== socket.id)

          if (!opponent) {
            socket.emit("error", { message: "Opponent not found" })
            return
          }

          let hit = false
          let sunkShip: Ship | null = null

          for (const ship of opponent.ships) {
            for (const pos of ship.positions) {
              if (pos.x === position.x && pos.y === position.y && !pos.hit) {
                pos.hit = true
                hit = true

                const allHit = ship.positions.every((p) => p.hit)
                if (allHit) {
                  ship.sunk = true
                  sunkShip = ship
                }

                break
              }
            }

            if (hit) break
          }

          const allSunk = opponent.ships.every((ship) => ship.sunk)

          if (allSunk) {
            game.status = "finished"
            game.winner = socket.id

            io.to(gameId).emit("game_over", {
              gameId,
              winner: socket.id,
              game,
            })
          } else {
            game.currentTurn = opponent.id
            game.lastMoveTimestamp = Date.now()

            io.to(gameId).emit("move_result", {
              gameId,
              player: socket.id,
              position,
              hit,
              sunkShip,
              nextTurn: opponent.id,
            })
          }

          activeGames.set(gameId, game)
        } catch (error) {
          console.error("Error making move:", error)
          socket.emit("error", { message: "Failed to process move" })
        }
      }
    )

    socket.on("disconnect", () => {
      try {
        console.log(`User disconnected: ${socket.id}`)

        connectedUsers.delete(socket.id)

        for (const [gameId, game] of activeGames.entries()) {
          const playerIndex = game.players.findIndex((p) => p.id === socket.id)

          if (playerIndex !== -1) {
            if (game.status === "waiting") {
              game.players = game.players.filter((p) => p.id !== socket.id)

              if (game.players.length === 0) {
                activeGames.delete(gameId)
              } else {
                io.to(gameId).emit("player_left", {
                  gameId,
                  playerId: socket.id,
                })

                activeGames.set(gameId, game)
              }
            } else if (game.status === "playing") {
              game.status = "finished"
              game.winner =
                game.players.find((p) => p.id !== socket.id)?.id || null

              io.to(gameId).emit("game_over", {
                gameId,
                winner: game.winner,
                reason: "opponent_disconnected",
                game,
              })

              setTimeout(() => {
                activeGames.delete(gameId)
              }, 60000)
            }
          }
        }
      } catch (error) {
        console.error("Error handling disconnect:", error)
      }
    })
  })
}
