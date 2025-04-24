import type { Request, Response } from "express"
import {
  getAllPosts,
  createNewPost,
  getUserFriends,
  createFriendRequest,
  checkFriendshipExists,
  getFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from "./model"
import { query } from "../../shared/config/database"

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await getAllPosts()
    res.json({ posts })
  } catch (error) {
    console.error("Get posts error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createPost = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const postId = await createNewPost(userId, content)
    const posts = await getAllPosts(postId)

    res.status(201).json({ post: posts[0] })
  } catch (error) {
    console.error("Create post error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getFriends = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const friends = await getUserFriends(userId)
    res.json({ friends })
  } catch (error) {
    console.error("Get friends error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const sendFriendRequest = async (req: Request, res: Response) => {
  try {
    const { username } = req.body
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    // Find the user by username
    const [recipient] = await query("SELECT id FROM users WHERE username = ?", [
      username,
    ])

    if (!recipient) {
      return res.status(404).json({ message: "User not found" })
    }

    const friendId = recipient.id

    // Check if already friends
    const existing = await checkFriendshipExists(userId, friendId)
    if (existing) {
      return res.status(400).json({ message: "Friend request already exists" })
    }

    await createFriendRequest(userId, friendId)
    res.status(201).json({ message: "Friend request sent" })
  } catch (error) {
    console.error("Friend request error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getFriendRequestsList = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const requests = await getFriendRequests(userId)
    res.json({ requests })
  } catch (error) {
    console.error("Get friend requests error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const acceptRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const success = await acceptFriendRequest(
      Number.parseInt(requestId),
      userId
    )

    if (!success) {
      return res.status(404).json({ message: "Friend request not found" })
    }

    res.json({ message: "Friend request accepted" })
  } catch (error) {
    console.error("Accept friend request error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const rejectRequest = async (req: Request, res: Response) => {
  try {
    const { requestId } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    const success = await rejectFriendRequest(
      Number.parseInt(requestId),
      userId
    )

    if (!success) {
      return res.status(404).json({ message: "Friend request not found" })
    }

    res.json({ message: "Friend request rejected" })
  } catch (error) {
    console.error("Reject friend request error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
