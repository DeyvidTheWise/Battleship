import { query } from "../../shared/config/database"

export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  created_at: Date
}

export interface UserAchievement {
  id: number
  user_id: number
  achievement_id: number
  unlocked_at: Date
}

export const getAchievements = async (): Promise<Achievement[]> => {
  return query("SELECT * FROM achievements ORDER BY id ASC")
}

export const getUserAchievementsList = async (userId: number): Promise<Achievement[]> => {
  return query(
    `
    SELECT 
      a.id, 
      a.name, 
      a.description, 
      a.icon, 
      ua.unlocked_at
    FROM 
      achievements a
    JOIN 
      user_achievements ua ON a.id = ua.achievement_id
    WHERE 
      ua.user_id = ?
    ORDER BY 
      ua.unlocked_at DESC
  `,
    [userId],
  )
}

export const checkUserHasAchievement = async (userId: number, achievementId: number): Promise<boolean> => {
  const result = await query("SELECT * FROM user_achievements WHERE user_id = ? AND achievement_id = ?", [
    userId,
    achievementId,
  ])
  return result.length > 0
}

export const addUserAchievement = async (userId: number, achievementId: number): Promise<number> => {
  const result = await query(
    "INSERT INTO user_achievements (user_id, achievement_id, unlocked_at) VALUES (?, ?, NOW())",
    [userId, achievementId],
  )
  return result.insertId
}
