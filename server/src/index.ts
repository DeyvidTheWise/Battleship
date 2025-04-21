import express from "express"
import cors from "cors"
import { createServer } from "http"
import { io } from "./sockets/socketManager"
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
import authRouter from "./routes/auth"

const app = express()
const httpServer = createServer(app)

app.use(cors({ origin: "http://localhost:3000" }))
app.use(express.json())

app.use("/api/auth", authRouter)

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

// Attach Socket.IO to httpServer
io.attach(httpServer)

httpServer.listen(5000, () => {
  console.log("Server running on port 5000")
})
