import express, { Router, RequestHandler } from "express"
import { db } from "../services/dbService"
import { generateToken } from "../services/authService"
import { RowDataPacket } from "mysql2"

interface LoginRequestBody {
  email: string
  password: string
}

const router: Router = express.Router()

const loginHandler: RequestHandler<{}, any, LoginRequestBody, {}> = async (
  req,
  res
) => {
  const { email, password } = req.body

  try {
    const [rows] = await db.query<RowDataPacket[]>(
      "SELECT * FROM users WHERE email = ? AND password = ?",
      [email, password]
    )

    if (rows.length === 0) {
      res.status(401).json({ error: "Invalid credentials" })
      return
    }

    const user = rows[0]
    const token = generateToken(user.id)
    res.json({
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        xp: user.xp,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
}

router.post("/login", loginHandler)

export default router
