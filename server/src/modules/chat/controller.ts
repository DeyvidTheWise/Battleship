import type { Request, Response } from "express"
import {
  getMessages as getMessagesModel,
  createMessage,
  markMessagesAsRead,
} from "./model"

export const getChatMessages = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const userId = Number.parseInt(req.params.userId)
    const messages = await getMessagesModel(req.user.id, userId)

    res.json({ messages })
  } catch (error) {
    console.error("Get messages error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

// Add this alias export to match what's being imported in routes.ts
export const getMessages = getChatMessages

export const sendMessage = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const { receiverId, content } = req.body

    if (!receiverId || !content) {
      return res
        .status(400)
        .json({ message: "Receiver ID and content are required" })
    }

    const messageId = await createMessage(req.user.id, receiverId, content)

    res.status(201).json({
      message: {
        id: messageId,
        sender_id: req.user.id,
        receiver_id: receiverId,
        content,
        read: false,
        created_at: new Date(),
      },
    })
  } catch (error) {
    console.error("Send message error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const markAsRead = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" })
    }

    const senderId = Number.parseInt(req.params.userId)
    const success = await markMessagesAsRead(senderId, req.user.id)

    if (!success) {
      return res
        .status(404)
        .json({ message: "No messages found or already marked as read" })
    }

    res.json({ message: "Messages marked as read" })
  } catch (error) {
    console.error("Mark as read error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
