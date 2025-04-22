import { schedule } from "node-cron"
import { Database } from "sqlite3"
import mysql from "mysql2/promise"
import { writeFileSync, readFileSync, existsSync } from "fs"
import { v4 as uuidv4 } from "uuid"
import { logger } from "../utils/logger"

interface AuditLog {
  audit_id: string
  table_name: string
  user_id: string
  action: "INSERT" | "UPDATE" | "DELETE"
  old_data: any
  new_data: any
  timestamp: Date
}

interface CountRow {
  count: number
}

const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "battleship",
}

const backupPath = "current_archive.sql"
const suspectPath = (date: string) =>
  `suspect_archives/suspect_archive_${date}.sql`
const suspectLogPath = (date: string) =>
  `suspect_archives/suspect_archive_${date}_log.txt`

const formatDate = (date: Date) => date.toISOString().split("T")[0]

const backupDatabase = async (): Promise<string> => {
  const connection = await mysql.createConnection(mysqlConfig)
  const [tables] = await connection.query("SHOW TABLES")
  let dump = ""

  for (const table of tables as any[]) {
    const tableName = Object.values(table)[0]
    const [rows] = await connection.query(`SELECT * FROM ${tableName}`)
    dump += `-- Table ${tableName}\n`
    for (const row of rows as any[]) {
      const columns = Object.keys(row).join(", ")
      const values = Object.values(row)
        .map((val) => (typeof val === "string" ? `'${val}'` : val))
        .join(", ")
      dump += `INSERT INTO ${tableName} (${columns}) VALUES (${values});\n`
    }
  }

  await connection.end()
  return dump
}

const validateArchive = async (
  newDump: string,
  date: string
): Promise<{ isValid: boolean; message: string; auditLogs: AuditLog[] }> => {
  const oldDump = existsSync(backupPath) ? readFileSync(backupPath, "utf8") : ""

  const sqliteDb = new Database(":memory:", (err) => {
    if (err) {
      logger.error(`Failed to open SQLite database: ${err.message}`)
      throw err
    }
  })

  const sqliteConnection: Database = await new Promise((resolve, reject) => {
    sqliteDb.serialize(() => {
      sqliteDb.run("CREATE TABLE Users (user_id TEXT)", (err) => {
        if (err) return reject(err)
        sqliteDb.run("CREATE TABLE Games (game_id TEXT)", (err) => {
          if (err) return reject(err)
          resolve(sqliteDb)
        })
      })
    })
  })

  const loadDump = (dump: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      sqliteConnection.exec(dump, (err) => {
        if (err) return reject(err)
        resolve()
      })
    })
  }

  await loadDump(oldDump)
  const oldUsers = await new Promise<number>((resolve, reject) => {
    sqliteConnection.get(
      "SELECT COUNT(*) as count FROM Users",
      (err: Error | null, row: CountRow) => {
        if (err) return reject(err)
        resolve(row.count || 0)
      }
    )
  })
  const oldGames = await new Promise<number>((resolve, reject) => {
    sqliteConnection.get(
      "SELECT COUNT(*) as count FROM Games",
      (err: Error | null, row: CountRow) => {
        if (err) return reject(err)
        resolve(row.count || 0)
      }
    )
  })

  await loadDump(newDump)
  const newUsers = await new Promise<number>((resolve, reject) => {
    sqliteConnection.get(
      "SELECT COUNT(*) as count FROM Users",
      (err: Error | null, row: CountRow) => {
        if (err) return reject(err)
        resolve(row.count || 0)
      }
    )
  })
  const newGames = await new Promise<number>((resolve, reject) => {
    sqliteConnection.get(
      "SELECT COUNT(*) as count FROM Games",
      (err: Error | null, row: CountRow) => {
        if (err) return reject(err)
        resolve(row.count || 0)
      }
    )
  })

  sqliteConnection.close()

  const isValid = newUsers >= oldUsers && newGames >= oldGames
  const message = isValid
    ? "Archive is valid"
    : `Invalid archive: Users ${newUsers} < ${oldUsers} or Games ${newGames} < ${oldGames}`

  const connection = await mysql.createConnection(mysqlConfig)
  const [auditLogs] = await connection.query(
    'SELECT * FROM AuditLog WHERE table_name IN ("Users", "Games")'
  )
  await connection.end()

  return { isValid, message, auditLogs: auditLogs as AuditLog[] }
}

const notifyAdmin = async (
  message: string,
  suspectFile: string,
  logFile: string
) => {
  const connection = await mysql.createConnection(mysqlConfig)
  await connection.execute(
    "INSERT INTO CMSContent (content_id, type, content, created_at) VALUES (?, ?, ?, ?)",
    [
      uuidv4(),
      "announcement",
      `Archive validation failed: ${message}. Suspect file: ${suspectFile}, Log: ${logFile}`,
      new Date(),
    ]
  )
  await connection.end()
}

const manageArchive = async () => {
  const date = formatDate(new Date())
  const newDump = await backupDatabase()
  const { isValid, message, auditLogs } = await validateArchive(newDump, date)

  if (isValid) {
    writeFileSync(backupPath, newDump)
    logger.info(`Archive updated successfully on ${date}`)
  } else {
    const suspectFile = suspectPath(date)
    const suspectLogFile = suspectLogPath(date)
    writeFileSync(suspectFile, newDump)
    writeFileSync(
      suspectLogFile,
      `${message}\n\nAudit Logs:\n${JSON.stringify(auditLogs, null, 2)}`
    )
    await notifyAdmin(message, suspectFile, suspectLogFile)
    logger.error(`Archive validation failed on ${date}: ${message}`)
  }
}

// Schedule daily at midnight
schedule("0 0 * * *", manageArchive)
