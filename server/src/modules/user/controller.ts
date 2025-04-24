import type { Request, Response } from "express"
import bcrypt from "bcrypt"
import {
  findUserById,
  updateUser,
  getAllUsers as getAllUsersModel,
  deleteUser as deleteUserModel,
} from "./model"

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const user = await findUserById(req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { password, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Get profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const { username, email, password, currentPassword, bio, avatar } = req.body
    const updates: any = {}

    if (password) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to set a new password",
        })
      }

      const user = await findUserById(req.user.id)
      if (!user) {
        return res.status(404).json({ message: "User not found" })
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password)
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" })
      }

      const salt = await bcrypt.genSalt(10)
      updates.password = await bcrypt.hash(password, salt)
    }

    if (username) updates.username = username
    if (email) updates.email = email
    if (bio) updates.bio = bio
    if (avatar) updates.avatar = avatar

    const success = await updateUser(req.user.id, updates)
    if (!success) {
      return res.status(400).json({ message: "Failed to update profile" })
    }

    const updatedUser = await findUserById(req.user.id)
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" })
    }

    const { password: _, ...userWithoutPassword } = updatedUser

    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Update profile error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsersModel()

    const usersWithoutPasswords = users.map((user) => {
      const { password, ...userWithoutPassword } = user
      return userWithoutPassword
    })

    res.json({ users: usersWithoutPasswords })
  } catch (error) {
    console.error("Get all users error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userId = Number.parseInt(req.params.id)
    const user = await findUserById(userId)

    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    const { password, ...userWithoutPassword } = user

    res.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Get user by ID error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userId = Number.parseInt(req.params.id)
    const success = await deleteUserModel(userId)

    if (!success) {
      return res
        .status(404)
        .json({ message: "User not found or could not be deleted" })
    }

    res.json({ message: "User deleted successfully" })
  } catch (error) {
    console.error("Delete user error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
