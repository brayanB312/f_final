import { NextResponse } from "next/server"
import { pool } from "@/db/db"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { correo, contrasena } = body

    if (!correo || !contrasena) {
      return NextResponse.json({ error: "Correo y contraseña son requeridos" }, { status: 400 })
    }

    // Buscar solo en la tabla de gobierno
    const [gobierno] = await pool.query(
      "SELECT id, nombre_completo, correo, contrasea FROM gobierno WHERE correo = ?",
      [correo],
    )

    if (Array.isArray(gobierno) && gobierno.length > 0) {
      const usuario = gobierno[0] as any

      // Verificar contraseña (nota: en la tabla gobierno el campo se llama "contrasea")
      const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasea)

      if (passwordMatch) {
        return NextResponse.json({
          success: true,
          userId: usuario.id,
          userName: usuario.nombre_completo,
        })
      }
    }

    // Si llegamos aquí, las credenciales son inválidas
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
  } catch (error) {
    console.error("Error en la autenticación:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

