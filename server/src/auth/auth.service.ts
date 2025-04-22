import { getConnection } from "../utils/db"
import { User } from "@shared-types"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your_jwt_secret"

export const register = async (
  email: string,
  username: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user: User = {
    user_id: uuidv4(),
    email,
    username,
    password: hashedPassword,
    elo: 1000,
    wins: 0,
    losses: 0,
    created_at: new Date(),
  }

  const connection = await getConnection()
  await connection.execute(
    "INSERT INTO Users (user_id, email, username, password, elo, wins, losses, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [
      user.user_id,
      user.email,
      user.username,
      user.password,
      user.elo,
      user.wins,
      user.losses,
      user.created_at,
    ]
  )
  await connection.end()

  const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
    expiresIn: "1h",
  })
  return { token, user }
}

export const login = async (
  email: string,
  password: string
): Promise<{ token: string; user: User }> => {
  const connection = await getConnection()
  const [rows] = await connection.execute(
    "SELECT * FROM Users WHERE email = ?",
    [email]
  )
  const user = (rows as User[])[0]
  await connection.end()

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error("Invalid credentials")
  }

  const token = jwt.sign({ user_id: user.user_id }, JWT_SECRET, {
    expiresIn: "1h",
  })
  return { token, user }
}

export const getProfile = async (user_id: string): Promise<User> => {
  const connection = await getConnection()
  const [rows] = await connection.execute(
    "SELECT * FROM Users WHERE user_id = ?",
    [user_id]
  )
  await connection.end()
  return (rows as User[])[0]
}
