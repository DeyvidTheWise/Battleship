import { db } from "./dbService"
import { RowDataPacket } from "mysql2"
import { v4 as uuidv4 } from "uuid"

export const saveMessage = async (
  senderId: string,
  receiverId: string | null,
  gameId: string | null,
  message: string
) => {
  const id = uuidv4()
  await db.query(
    "INSERT INTO messages (id, sender_id, receiver_id, game_id, message) VALUES (?, ?, ?, ?, ?)",
    [id, senderId, receiverId, gameId, message]
  )
}

export const getDirectMessages = async (userId: string, friendId: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT m.*, u.firstname, u.lastname FROM messages m JOIN users u ON m.sender_id = u.id WHERE (m.sender_id = ? AND m.receiver_id = ? AND m.game_id IS NULL) OR (m.sender_id = ? AND m.receiver_id = ? AND m.game_id IS NULL) ORDER BY m.sent_at ASC",
    [userId, friendId, friendId, userId]
  )
  return rows
}

export const getGameMessages = async (gameId: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT m.*, u.firstname, u.lastname FROM messages m JOIN users u ON m.sender_id = u.id WHERE m.game_id = ? AND m.receiver_id IS NULL ORDER BY m.sent_at ASC",
    [gameId]
  )
  return rows
}
