import { query } from "../../shared/config/database"

// Export the interface so it can be used in other files
export interface Message {
  id: number
  sender_id: number
  receiver_id: number
  content: string
  read: boolean
  created_at: Date
  // Add optional fields that might come from JOIN queries
  sender_username?: string
  receiver_username?: string
}

// Define the query result types
interface QueryResult {
  insertId?: number
  affectedRows?: number
}

// Get messages between two users
export const getMessages = async (
  userId: number,
  otherUserId: number
): Promise<Message[]> => {
  try {
    const messages = await query(
      `SELECT 
        m.*,
        u1.username as sender_username,
        u2.username as receiver_username
      FROM 
        messages m
      LEFT JOIN 
        users u1 ON m.sender_id = u1.id
      LEFT JOIN 
        users u2 ON m.receiver_id = u2.id
      WHERE 
        (m.sender_id = ? AND m.receiver_id = ?) 
        OR (m.sender_id = ? AND m.receiver_id = ?) 
      ORDER BY 
        m.created_at ASC`,
      [userId, otherUserId, otherUserId, userId]
    )

    // Transform date strings to Date objects
    return (messages as any[]).map((msg) => ({
      ...msg,
      created_at:
        msg.created_at instanceof Date
          ? msg.created_at
          : new Date(msg.created_at),
    }))
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to get messages")
  }
}

// Create a new message
export const createMessage = async (
  senderId: number,
  receiverId: number,
  content: string
): Promise<number> => {
  try {
    const result = (await query(
      `INSERT INTO messages (sender_id, receiver_id, content, read, created_at) 
       VALUES (?, ?, ?, false, NOW())`,
      [senderId, receiverId, content]
    )) as QueryResult

    if (result.insertId === undefined) {
      throw new Error("Failed to get insert ID")
    }

    return result.insertId
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to create message")
  }
}

// Mark messages as read
export const markMessagesAsRead = async (
  senderId: number,
  receiverId: number
): Promise<boolean> => {
  try {
    const result = (await query(
      `UPDATE messages 
       SET read = true 
       WHERE sender_id = ? AND receiver_id = ? AND read = false`,
      [senderId, receiverId]
    )) as QueryResult

    return result.affectedRows !== undefined && result.affectedRows > 0
  } catch (error) {
    console.error("Database error:", error)
    throw new Error("Failed to mark messages as read")
  }
}
