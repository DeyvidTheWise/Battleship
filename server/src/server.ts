import express from "express"
import { createServer } from "http"
import { initSocket } from "./utils/socket"
import authRoutes from "./auth/auth.routes"
import gameRoutes from "./game/game.routes"
import socialRoutes from "./social/social.routes"
import cmsRoutes from "./cms/cms.routes"
import aiRoutes from "./ai/ai.routes"
import "../database/archive/archive_manager"

const app = express()
const server = createServer(app)

initSocket(server)

app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/game", gameRoutes)
app.use("/api/social", socialRoutes)
app.use("/api/cms", cmsRoutes)
app.use("/api/ai", aiRoutes)

const PORT = 3000
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
