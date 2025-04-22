import { getConnection } from "../utils/db"
import { Friend, ChatMessage } from "@shared-types"
import { v4 as uuidv4 } from "uuid"
import { getIO } from "../utils/socket"

export const getFriends = async (user_id: string): Promise<Friend[]> => {
  const connection = await getConnection()
  const [rows] = await connection.execute(
    'SELECT * FROM Friends WHERE user_id = ? AND status = "accepted"',
    [user_id]
  )
  await connection.end()
  return rows as Friend[]
}

export const addFriend = async (
  user_id: string,
  friend_username: string
): Promise<void> => {
  const connection = await getConnection()
  const [users] = await connection.execute(
    "SELECT user_id FROM Users WHERE username = ?",
    [friend_username]
  )
  const friend = (users as { user_id: string }[])[0]
  if (!friend) throw new Error("User not found")

  const friendship: Friend = {
    friendship_id: uuidv4(),
    user_id,
    friend_id: friend.user_id,
    status: "pending",
    created_at: new Date(),
  }

  await connection.execute(
    "INSERT INTO Friends (friendship_id, user_id, friend_id, status, created_at) VALUES (?, ?, ?, ?, ?)",
    [
      friendship.friendship_id,
      friendship.user_id,
      friendship.friend_id,
      friendship.status,
      friendship.created_at,
    ]
  )
  await connection.end()

  const io = getIO()
  io.emit("friend-status", { user_id: friend.user_id, status: "pending" })
}

export const sendChatMessage = async (
  sender_id: string,
  game_id: string | undefined,
  receiver_id: string | undefined,
  content: string
): Promise<void> => {
  const message: ChatMessage = {
    message_id: uuidv4(),
    sender_id,
    game_id,
    receiver_id,
    content,
    created_at: new Date(),
  }

  const connection = await getConnection()
  await connection.execute(
    "INSERT INTO ChatMessages (message_id, sender_id, game_id, receiver_id, content, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [
      message.message_id,
      message.sender_id,
      message.game_id,
      message.receiver_id,
      message.content,
      message.created_at,
    ]
  )
  await connection.end()

  const io = getIO()
  io.emit("chat-message", message)
}

export const updateProfile = async (
  user_id: string,
  avatar?: string,
  bio?: string
): Promise<void> => {
  const connection = await getConnection()
  await connection.execute(
    "UPDATE Users SET avatar = ?, bio = ? WHERE user_id = ?",
    [avatar, bio, user_id]
  )
  await connection.end()
}
