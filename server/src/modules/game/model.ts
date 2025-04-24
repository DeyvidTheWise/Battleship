import { query } from "../../shared/config/database"

export interface GameResult {
  id: number
  winner_id: number
  loser_id: number
  result: string
  created_at: Date
}

export const getLeaderboardData = async () => {
  return query(`
    SELECT 
      u.id, 
      u.username, 
      s.games_played, 
      s.games_won, 
      s.win_rate 
    FROM 
      users u
    JOIN 
      user_statistics s ON u.id = s.user_id
    ORDER BY 
      s.win_rate DESC, s.games_won DESC
    LIMIT 20
  `)
}

export const getUserHistory = async (userId: number) => {
  return query(
    `
    SELECT 
      gr.id,
      gr.result,
      gr.created_at,
      CASE 
        WHEN gr.winner_id = ? THEN 'win'
        ELSE 'loss'
      END as outcome,
      u.username as opponent
    FROM 
      game_results gr
    JOIN 
      users u ON (gr.winner_id = ? AND gr.loser_id = u.id) OR (gr.loser_id = ? AND gr.winner_id = u.id)
    WHERE 
      gr.winner_id = ? OR gr.loser_id = ?
    ORDER BY 
      gr.created_at DESC
    LIMIT 20
  `,
    [userId, userId, userId, userId, userId],
  )
}

export const saveGameResult = async (winnerId: number, loserId: number, result: string): Promise<number> => {
  const gameResult = await query(
    "INSERT INTO game_results (winner_id, loser_id, result, created_at) VALUES (?, ?, ?, NOW())",
    [winnerId, loserId, result],
  )
  return gameResult.insertId
}
