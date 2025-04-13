import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { db } from "./dbService"
import { RowDataPacket } from "mysql2"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export const registerUser = async (
  firstname: string,
  lastname: string,
  email: string,
  password: string
): Promise<string> => {
  const id = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    await db.query(
      "INSERT INTO users (id, firstname, lastname, email, password) VALUES (?, ?, ?, ?, ?)",
      [id, firstname, lastname, email, hashedPassword]
    )
    return id
  } catch (error: any) {
    if (error.code === "ER_DUP_ENTRY") {
      throw new Error("Email already exists")
    }
    throw new Error("Failed to register user: " + error.message)
  }
}

export const loginUser = async (email: string, password: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  )

  if (rows.length === 0) {
    throw new Error("Invalid email or password")
  }

  const user = rows[0]
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw new Error("Invalid email or password")
  }

  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1h" })
  return {
    token,
    user: {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      xp: user.xp,
    },
  }
}

export const getUserById = async (id: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT id, firstname, lastname, email, xp, bio FROM users WHERE id = ?",
    [id]
  )

  if (rows.length === 0) {
    throw new Error("User not found")
  }

  return rows[0]
}

export const updateUserXp = async (id: string, xp: number) => {
  await db.query("UPDATE users SET xp = xp + ? WHERE id = ?", [xp, id])
}

export const updateUserBio = async (id: string, bio: string) => {
  await db.query("UPDATE users SET bio = ? WHERE id = ?", [bio, id])
}
