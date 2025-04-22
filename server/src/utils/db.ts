import mysql from "mysql2/promise"

const mysqlConfig = {
  host: "localhost",
  user: "root",
  password: "password",
  database: "battleship",
}

export const getConnection = async () => {
  return await mysql.createConnection(mysqlConfig)
}
