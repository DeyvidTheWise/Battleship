import { query } from "../../shared/config/database"

export interface Tournament {
  id: number
  name: string
  description: string
  start_date: Date
  end_date: Date
  max_players: number
  prize: string
  status: "upcoming" | "active" | "completed"
  created_at: Date
  updated_at: Date
}

export interface TournamentPlayer {
  id: number
  tournament_id: number
  user_id: number
  joined_at: Date
}

export const getTournaments = async (): Promise<Tournament[]> => {
  return query(`
    SELECT 
      t.*,
      COUNT(tp.id) as player_count
    FROM 
      tournaments t
    LEFT JOIN 
      tournament_players tp ON t.id = tp.tournament_id
    GROUP BY 
      t.id
    ORDER BY 
      CASE 
        WHEN t.status = 'active' THEN 1
        WHEN t.status = 'upcoming' THEN 2
        ELSE 3
      END,
      t.start_date ASC
  `)
}

export const getTournament = async (id: number): Promise<Tournament | null> => {
  const tournaments = await query(
    `
    SELECT 
      t.*,
      COUNT(tp.id) as player_count
    FROM 
      tournaments t
    LEFT JOIN 
      tournament_players tp ON t.id = tp.tournament_id
    WHERE 
      t.id = ?
    GROUP BY 
      t.id
  `,
    [id],
  )

  if (tournaments.length === 0) {
    return null
  }

  // Get players in tournament
  const players = await query(
    `
    SELECT 
      u.id,
      u.username,
      tp.joined_at
    FROM 
      tournament_players tp
    JOIN 
      users u ON tp.user_id = u.id
    WHERE 
      tp.tournament_id = ?
    ORDER BY 
      tp.joined_at ASC
  `,
    [id],
  )

  return {
    ...tournaments[0],
    players,
  }
}

export const createNewTournament = async (data: Partial<Tournament>): Promise<number> => {
  const { name, description, start_date, end_date, max_players, prize } = data

  const result = await query(
    `INSERT INTO tournaments 
      (name, description, start_date, end_date, max_players, prize, status, created_at) 
     VALUES 
      (?, ?, ?, ?, ?, ?, 'upcoming', NOW())`,
    [name, description, start_date, end_date, max_players, prize],
  )

  return result.insertId
}

export const updateTournamentDetails = async (id: number, data: Partial<Tournament>): Promise<boolean> => {
  const { name, description, start_date, end_date, max_players, prize, status } = data

  const result = await query(
    `UPDATE tournaments 
     SET 
      name = COALESCE(?, name),
      description = COALESCE(?, description),
      start_date = COALESCE(?, start_date),
      end_date = COALESCE(?, end_date),
      max_players = COALESCE(?, max_players),
      prize = COALESCE(?, prize),
      status = COALESCE(?, status),
      updated_at = NOW()
     WHERE 
      id = ?`,
    [name, description, start_date, end_date, max_players, prize, status, id],
  )

  return result.affectedRows > 0
}

export const checkPlayerInTournament = async (tournamentId: number, userId: number): Promise<boolean> => {
  const result = await query("SELECT * FROM tournament_players WHERE tournament_id = ? AND user_id = ?", [
    tournamentId,
    userId,
  ])

  return result.length > 0
}

export const addPlayerToTournament = async (tournamentId: number, userId: number): Promise<number> => {
  const result = await query(
    "INSERT INTO tournament_players (tournament_id, user_id, joined_at) VALUES (?, ?, NOW())",
    [tournamentId, userId],
  )

  return result.insertId
}

export const removePlayerFromTournament = async (tournamentId: number, userId: number): Promise<boolean> => {
  const result = await query("DELETE FROM tournament_players WHERE tournament_id = ? AND user_id = ?", [
    tournamentId,
    userId,
  ])

  return result.affectedRows > 0
}
