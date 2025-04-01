import mysql from "mysql2/promise"

// Crear un pool de conexiones a la base de datos
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_DATABASE || "fam_share",
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : 3306,
  connectionLimit: 10,
})

export { pool }
