import { db } from "./dbService"
import { RowDataPacket } from "mysql2"
import { v4 as uuidv4 } from "uuid"

export const sendFriendRequest = async (userId: string, friendId: string) => {
  if (userId === friendId)
    throw new Error("Cannot send friend request to yourself")

  const [existing] = await db.query<RowDataPacket[]>(
    "SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
    [userId, friendId, friendId, userId]
  )

  if (existing.length > 0)
    throw new Error("Friend request already exists or you are already friends")

  await db.query(
    "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)",
    [userId, friendId, "pending"]
  )
}

export const acceptFriendRequest = async (userId: string, friendId: string) => {
  const [requests] = await db.query<RowDataPacket[]>(
    "SELECT * FROM friends WHERE user_id = ? AND friend_id = ? AND status = ?",
    [friendId, userId, "pending"]
  )

  if (requests.length === 0) throw new Error("No pending friend request found")

  await db.query(
    "UPDATE friends SET status = ? WHERE user_id = ? AND friend_id = ?",
    ["accepted", friendId, userId]
  )

  // Add the reverse relationship
  await db.query(
    "INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)",
    [userId, friendId, "accepted"]
  )
}

export const getFriends = async (userId: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT u.id, u.firstname, u.lastname FROM friends f JOIN users u ON f.friend_id = u.id WHERE f.user_id = ? AND f.status = ?",
    [userId, "accepted"]
  )
  return rows
}

export const getFriendRequests = async (userId: string) => {
  const [rows] = await db.query<RowDataPacket[]>(
    "SELECT u.id, u.firstname, u.lastname FROM friends f JOIN users u ON f.user_id = u.id WHERE f.friend_id = ? AND f.status = ?",
    [userId, "pending"]
  )
  return rows
}
