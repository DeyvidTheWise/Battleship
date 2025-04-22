import { getConnection } from "../utils/db"
import { CMSContent, Analytic } from "@shared-types"
import { v4 as uuidv4 } from "uuid"
import { getIO } from "../utils/socket"

export const createAnnouncement = async (
  admin_id: string,
  content: string,
  schedule?: Date
): Promise<void> => {
  const announcement: CMSContent = {
    content_id: uuidv4(),
    type: "announcement",
    content,
    schedule,
    created_at: new Date(),
  }

  const connection = await getConnection()
  await connection.execute(
    "INSERT INTO CMSContent (content_id, type, content, schedule, created_at) VALUES (?, ?, ?, ?, ?)",
    [
      announcement.content_id,
      announcement.type,
      announcement.content,
      announcement.schedule,
      announcement.created_at,
    ]
  )
  await connection.end()

  if (!schedule || new Date(schedule) <= new Date()) {
    const io = getIO()
    io.emit("announcement", announcement)
  }
}

export const getAnalytics = async (dateRange: {
  start: Date
  end: Date
}): Promise<Analytic[]> => {
  const connection = await getConnection()
  const [rows] = await connection.execute(
    "SELECT * FROM Analytics WHERE date BETWEEN ? AND ?",
    [dateRange.start, dateRange.end]
  )
  await connection.end()
  return rows as Analytic[]
}

export const getContent = async (): Promise<CMSContent[]> => {
  const connection = await getConnection()
  const [rows] = await connection.execute("SELECT * FROM CMSContent")
  await connection.end()
  return rows as CMSContent[]
}
