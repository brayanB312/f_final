"use server"

import { pool } from "@/db/db"

export async function getGobiernoUser() {
  try {
    const [rows] = await pool.query("SELECT nombre_completo FROM gobierno LIMIT 1")

    if (Array.isArray(rows) && rows.length > 0) {
      return {
        success: true,
        data: rows[0],
      }
    }

    return {
      success: false,
      error: "No se encontraron usuarios de gobierno",
    }
  } catch (error) {
    console.error("Error al obtener datos de gobierno:", error)
    return {
      success: false,
      error: "Error al consultar la base de datos",
    }
  }
}

