import express from "express"
import cors from "cors" // Add CORS import
import { createServer } from "http"
import { Server } from "socket.io"
import { socketHandler } from "./sockets/socketManager"
import { register, login } from "./controllers/authController"
import { getLeaderboard } from "./controllers/leaderboardController"
import {
  getProfile,
  updateProfile,
  getGameHistory,
} from "./controllers/profileController"
import {
  sendFriendRequestHandler,
  acceptFriendRequestHandler,
  getFriendsHandler,
  getFriendRequestsHandler,
} from "./controllers/friendController"
import { authMiddleware } from "./middlewares/authMiddleware"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
})

app.use(cors({ origin: "http://localhost:3000" })) // Add CORS middleware
app.use(express.json())

// Authentication Routes
app.post("/api/register", ...register)
app.post("/api/login", ...login)

// Leaderboard Route
app.get("/api/leaderboard", getLeaderboard)

// Profile Routes
app.get("/api/profile/:userId", getProfile)
app.put("/api/profile/:userId", authMiddleware, updateProfile)
app.get("/api/profile/:userId/history", getGameHistory)

// Friend Routes
app.post("/api/friends/request", authMiddleware, sendFriendRequestHandler)
app.post("/api/friends/accept", authMiddleware, acceptFriendRequestHandler)
app.get("/api/friends", authMiddleware, getFriendsHandler)
app.get("/api/friends/requests", authMiddleware, getFriendRequestsHandler)

// Socket.IO
socketHandler(io)

httpServer.listen(5000, () => {
  console.log("Server running on port 5000")
})
