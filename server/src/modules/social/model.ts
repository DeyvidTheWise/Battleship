import { query } from "../../shared/config/database"

export interface Post {
  id: number
  user_id: number
  content: string
  created_at: Date
}

export interface Friend {
  id: number
  user_id: number
  friend_id: number
  status: "pending" | "accepted" | "rejected"
  created_at: Date
}

export interface FriendRequest {
  id: number
  requester_id: number
  recipient_id: number
  status: "pending" | "accepted" | "rejected"
  created_at: Date
  username?: string
  avatar?: string
}

export const getAllPosts = async (postId?: number) => {
  let sql = `
    SELECT 
      p.id, 
      p.content, 
      p.created_at, 
      u.id as user_id, 
      u.username
    FROM 
      posts p
    JOIN 
      users u ON p.user_id = u.id
  `

  if (postId) {
    sql += " WHERE p.id = ?"
    return query(sql, [postId])
  } else {
    sql += " ORDER BY p.created_at DESC LIMIT 20"
    return query(sql)
  }
}

export const createNewPost = async (
  userId: number,
  content: string
): Promise<number> => {
  const result = await query(
    "INSERT INTO posts (user_id, content, created_at) VALUES (?, ?, NOW())",
    [userId, content]
  )
  return result.insertId
}

export const getUserFriends = async (userId: number) => {
  return query(
    `
    SELECT 
      u.id, 
      u.username, 
      u.avatar,
      CASE
        WHEN u.last_login > NOW() - INTERVAL 5 MINUTE THEN 'online'
        WHEN g.id IS NOT NULL THEN 'in-game'
        ELSE 'offline'
      END as status
    FROM 
      friends f
    JOIN 
      users u ON f.friend_id = u.id
    LEFT JOIN
      game_results g ON (g.winner_id = u.id OR g.loser_id = u.id) AND g.result = 'in-progress'
    WHERE 
      f.user_id = ? AND f.status = 'accepted'
    ORDER BY
      status ASC, u.username ASC
    `,
    [userId]
  )
}

export const checkFriendshipExists = async (
  userId: number,
  friendId: number
): Promise<boolean> => {
  const existing = await query(
    "SELECT * FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
    [userId, friendId, friendId, userId]
  )
  return existing.length > 0
}

export const createFriendRequest = async (
  userId: number,
  friendId: number
): Promise<void> => {
  await query(
    'INSERT INTO friends (user_id, friend_id, status, created_at) VALUES (?, ?, "pending", NOW())',
    [userId, friendId]
  )
}

export const getFriendRequests = async (userId: number) => {
  return query(
    `
    SELECT 
      f.id, 
      f.user_id as requester_id, 
      f.friend_id as recipient_id,
      f.created_at,
      u.username,
      u.avatar
    FROM 
      friends f
    JOIN 
      users u ON f.user_id = u.id
    WHERE 
      f.friend_id = ? AND f.status = 'pending'
    ORDER BY 
      f.created_at DESC
    `,
    [userId]
  )
}

export const acceptFriendRequest = async (
  requestId: number,
  userId: number
): Promise<boolean> => {
  const [request] = await query(
    "SELECT * FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'",
    [requestId, userId]
  )

  if (!request) {
    return false
  }

  const result = await query(
    "UPDATE friends SET status = 'accepted' WHERE id = ?",
    [requestId]
  )

  await query(
    "INSERT INTO friends (user_id, friend_id, status, created_at) VALUES (?, ?, 'accepted', NOW()) ON DUPLICATE KEY UPDATE status = 'accepted'",
    [userId, request.user_id]
  )

  return result.affectedRows > 0
}

export const rejectFriendRequest = async (
  requestId: number,
  userId: number
): Promise<boolean> => {
  const [request] = await query(
    "SELECT * FROM friends WHERE id = ? AND friend_id = ? AND status = 'pending'",
    [requestId, userId]
  )

  if (!request) {
    return false
  }

  const result = await query("DELETE FROM friends WHERE id = ?", [requestId])
  return result.affectedRows > 0
}
