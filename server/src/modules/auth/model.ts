import { query } from "../../shared/config/database"

export interface User {
  id: number
  username: string
  email: string
  password: string
  avatar?: string
  bio?: string
  role: string
  elo?: number
  games_played?: number
  games_won?: number
  games_lost?: number
  last_login?: Date
  created_at: Date
  updated_at: Date
}

export interface NewUser {
  username: string
  email: string
  password: string
  role: string
  avatar?: string
  bio?: string
}

export const createUser = async (user: NewUser): Promise<number> => {
  const result = await query(
    `INSERT INTO users 
     (username, email, password, role, avatar, bio, elo, games_played, games_won, games_lost) 
     VALUES (?, ?, ?, ?, ?, ?, 1000, 0, 0, 0)`,
    [
      user.username,
      user.email,
      user.password,
      user.role,
      user.avatar || null,
      user.bio || null,
    ]
  )
  return (result as any).insertId
}

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const users = await query("SELECT * FROM users WHERE email = ?", [email])
  return (users as User[])[0] || null
}

export const findUserByUsername = async (
  username: string
): Promise<User | null> => {
  const users = await query("SELECT * FROM users WHERE username = ?", [
    username,
  ])
  return (users as User[])[0] || null
}

export const findUserById = async (id: number): Promise<User | null> => {
  const users = await query("SELECT * FROM users WHERE id = ?", [id])
  return (users as User[])[0] || null
}

export const updateUser = async (
  id: number,
  updates: Partial<User>
): Promise<boolean> => {
  const {
    username,
    email,
    password,
    role,
    avatar,
    bio,
    elo,
    games_played,
    games_won,
    games_lost,
    last_login,
  } = updates
  const fields = []
  const values = []

  if (username) {
    fields.push("username = ?")
    values.push(username)
  }

  if (email) {
    fields.push("email = ?")
    values.push(email)
  }

  if (password) {
    fields.push("password = ?")
    values.push(password)
  }

  if (role) {
    fields.push("role = ?")
    values.push(role)
  }

  if (avatar !== undefined) {
    fields.push("avatar = ?")
    values.push(avatar)
  }

  if (bio !== undefined) {
    fields.push("bio = ?")
    values.push(bio)
  }

  if (elo !== undefined) {
    fields.push("elo = ?")
    values.push(elo)
  }

  if (games_played !== undefined) {
    fields.push("games_played = ?")
    values.push(games_played)
  }

  if (games_won !== undefined) {
    fields.push("games_won = ?")
    values.push(games_won)
  }

  if (games_lost !== undefined) {
    fields.push("games_lost = ?")
    values.push(games_lost)
  }

  if (last_login) {
    fields.push("last_login = ?")
    values.push(last_login)
  }

  if (fields.length === 0) {
    return false
  }

  fields.push("updated_at = NOW()")
  values.push(id)

  const result = await query(
    `UPDATE users SET ${fields.join(", ")} WHERE id = ?`,
    values
  )

  return (result as any).affectedRows > 0
}

export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await query("DELETE FROM users WHERE id = ?", [id])
  return (result as any).affectedRows > 0
}
