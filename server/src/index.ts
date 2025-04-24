import express from "express"
import http from "http"
import { Server } from "socket.io"
import cors from "cors"
import dotenv from "dotenv"
import { initializeSocketHandlers } from "./socket/handlers"
import { connectToDatabase } from "./shared/config/database"

import authRoutes from "./modules/auth/routes"
import userRoutes from "./modules/user/routes"
import gameRoutes from "./modules/game/routes"
import socialRoutes from "./modules/social/routes"
import chatRoutes from "./modules/chat/routes"
import cmsRoutes from "./modules/cms/routes"
import aiRoutes from "./modules/ai/routes"
import statisticsRoutes from "./modules/statistics/routes"
import achievementsRoutes from "./modules/achievements/routes"
import tournamentsRoutes from "./modules/tournaments/routes"

dotenv.config()

const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
})

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/game", gameRoutes)
app.use("/api/social", socialRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/cms", cmsRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/statistics", statisticsRoutes)
app.use("/api/achievements", achievementsRoutes)
app.use("/api/tournaments", tournamentsRoutes)

initializeSocketHandlers(io)

const PORT = process.env.PORT || 3001

const startServer = async () => {
  try {
    const dbConnected = await connectToDatabase()

    if (!dbConnected) {
      console.error("Failed to connect to database. Exiting...")
      process.exit(1)
    }

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Failed to start server:", error)
    process.exit(1)
  }
}

startServer()
