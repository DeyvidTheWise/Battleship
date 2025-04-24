import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "battleship",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,

  dateStrings: false,
})

export const connectToDatabase = async (): Promise<boolean> => {
  try {
    const connection = await pool.getConnection()
    console.log("Connected to MySQL database")
    connection.release()
    return true
  } catch (error) {
    console.error("Failed to connect to database:", error)
    return false
  }
}

export const query = async <T = any>(
  sql: string,
  params: any[] = []
): Promise<T> => {
  try {
    const [results] = await pool.execute(sql, params)
    return results as T
  } catch (error) {
    console.error("Database query error:", error)
    throw error
  }
}

export { pool }
