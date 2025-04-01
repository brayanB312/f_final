import { NextResponse } from "next/server"
import { pool } from "@/db/db"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extraer datos del cuerpo de la solicitud
    const { correo, contrasena } = body

    // Validar que los campos requeridos estén presentes
    if (!correo || !contrasena) {
      return NextResponse.json({ error: "Correo y contraseña son obligatorios" }, { status: 400 })
    }

    // Buscar el usuario por correo
    const [users] = await pool.execute("SELECT id, nombre_completo, contrasea FROM gobierno WHERE correo = ?", [correo])

    // Verificar si el usuario existe
    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const user = users[0] as { id: number; nombre_completo: string; contrasea: string }

    // Verificar la contraseña
    const passwordMatch = await bcrypt.compare(contrasena, user.contrasea)

    if (!passwordMatch) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    // Autenticación exitosa
    return NextResponse.json({
      success: true,
      userId: user.id.toString(),
      userName: user.nombre_completo,
    })
  } catch (error) {
    console.error("Error al iniciar sesión de gobierno:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

