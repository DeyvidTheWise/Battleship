import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import { initializeSocket } from "./sockets/socketManager"
import { db } from "./services/dbService"
import apiRoutes from "./routes/api"

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000", // Allow client origin
    methods: ["GET", "POST"],
  },
})

app.use(express.json())
app.use("/api", apiRoutes)

// Initialize Socket.io
initializeSocket(io)

// Test database connection
db.query("SELECT 1")
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Database connection failed:", err))

const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
