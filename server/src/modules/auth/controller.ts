import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {
  createUser,
  findUserByEmail,
  findUserById,
  findUserByUsername,
} from "./model"
import { query } from "../../shared/config/database"

export const register = async (req: Request, res: Response) => {
  try {
    console.log("Register request received:", req.body)
    const { username, email, password } = req.body

    // Validate required fields
    if (!username || !email || !password) {
      console.log("Missing required fields:", {
        username: !!username,
        email: !!email,
        password: !!password,
      })
      return res.status(400).json({
        message: "All fields are required",
        field: "general",
      })
    }

    console.log("Checking for existing user with email:", email)
    // Check if user already exists with this email
    const existingUserByEmail = await findUserByEmail(email)
    if (existingUserByEmail) {
      console.log("User already exists with email:", email)
      return res.status(400).json({
        message: "User already exists with this email",
        field: "email",
      })
    }

    console.log("Checking for existing user with username:", username)
    // Check if username is already taken
    const existingUserByUsername = await findUserByUsername(username)
    if (existingUserByUsername) {
      console.log("Username already taken:", username)
      return res.status(400).json({
        message: "Username is already taken",
        field: "username",
      })
    }

    console.log("Hashing password...")
    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    console.log("Creating user...")
    // Create user
    const userId = await createUser({
      username,
      email,
      password: hashedPassword,
      role: "user",
    })

    console.log("User created with ID:", userId)

    // Generate JWT
    const token = jwt.sign(
      { id: userId, username, role: "user" },
      process.env.JWT_SECRET || "secret",
      {
        expiresIn: "7d",
      }
    )

    console.log("Registration successful for user:", username)
    res.status(201).json({
      token,
      user: {
        id: userId,
        username,
        email,
        role: "user",
      },
    })
  } catch (error) {
    console.error("Registration error:", error)

    // Handle database errors more specifically
    if (error && typeof error === "object" && "code" in error) {
      const dbError = error as any

      // Handle duplicate entry errors
      if (dbError.code === "ER_DUP_ENTRY") {
        // Check if it's a duplicate username or email
        if (dbError.sqlMessage && dbError.sqlMessage.includes("username")) {
          return res.status(400).json({
            message: "Username is already taken",
            field: "username",
          })
        } else if (dbError.sqlMessage && dbError.sqlMessage.includes("email")) {
          return res.status(400).json({
            message: "Email is already registered",
            field: "email",
          })
        }
      }
    }

    // Generic server error if not handled above
    res.status(500).json({ message: "Server error" })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    // Find user
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    )

    // Update last login time
    await query("UPDATE users SET last_login = NOW() WHERE id = ?", [user.id])

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const user = await findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    res.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Get current user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const checkUsernameAvailability = async (
  req: Request,
  res: Response
) => {
  try {
    const { username } = req.query

    if (!username || typeof username !== "string") {
      return res.status(400).json({ message: "Username is required" })
    }

    // Check if username is already taken
    const existingUser = await findUserByUsername(username)

    return res.json({
      available: !existingUser,
      message: existingUser
        ? "Username is already taken"
        : "Username is available",
    })
  } catch (error) {
    console.error("Check username error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
