import { query } from "../../shared/config/database"

export interface UserStatistics {
  id: number
  user_id: number
  games_played: number
  games_won: number
  win_rate: number
  created_at: Date
  updated_at: Date
}

export const getUserStats = async (userId: number): Promise<UserStatistics | null> => {
  const stats = await query("SELECT * FROM user_statistics WHERE user_id = ?", [userId])
  return stats.length > 0 ? stats[0] : null
}

export const createUserStatistics = async (userId: number): Promise<number> => {
  const result = await query(
    "INSERT INTO user_statistics (user_id, games_played, games_won, win_rate, created_at) VALUES (?, 0, 0, 0, NOW())",
    [userId],
  )
  return result.insertId
}

export const updateStats = async (userId: number, data: Partial<UserStatistics>): Promise<boolean> => {
  const { games_played, games_won, win_rate } = data
  const result = await query(
    "UPDATE user_statistics SET games_played = ?, games_won = ?, win_rate = ?, updated_at = NOW() WHERE user_id = ?",
    [games_played, games_won, win_rate, userId],
  )
  return result.affectedRows > 0
}
