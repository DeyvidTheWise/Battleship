import { query } from "../../shared/config/database"

export interface User {
  id: number
  username: string
  email: string
  password: string
  role: string
  bio?: string
  avatar?: string
  created_at: Date
  updated_at: Date
}

export const findUserById = async (id: number): Promise<User | null> => {
  const users = await query("SELECT * FROM users WHERE id = ?", [id])
  return (users as User[])[0] || null
}

export const updateUser = async (id: number, updates: Partial<User>): Promise<boolean> => {
  const fields = []
  const values = []

  for (const [key, value] of Object.entries(updates)) {
    fields.push(`${key} = ?`)
    values.push(value)
  }

  if (fields.length === 0) {
    return false
  }

  fields.push("updated_at = NOW()")
  values.push(id)

  const result = await query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values)

  return (result as any).affectedRows > 0
}

export const getAllUsers = async (): Promise<User[]> => {
  return (await query("SELECT * FROM users ORDER BY created_at DESC")) as User[]
}

export const deleteUser = async (id: number): Promise<boolean> => {
  const result = await query("DELETE FROM users WHERE id = ?", [id])
  return (result as any).affectedRows > 0
}
