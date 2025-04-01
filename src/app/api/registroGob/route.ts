import { NextResponse } from "next/server"
import { pool } from "@/lib/db"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { nombre_completo, correo, fecha_nacimiento, telefono, ciudad, estado, genero, contrasena } = body

    // Validar que todos los campos requeridos estén presentes
    if (!nombre_completo || !correo || !fecha_nacimiento || !telefono || !ciudad || !estado || !contrasena) {
      return NextResponse.json({ error: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Verificar si el correo ya existe
    const [existingUsers] = await pool.query("SELECT id FROM gobierno WHERE correo = ?", [correo])

    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 409 })
    }

    // Encriptar la contraseña
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds)

    // Insertar el nuevo usuario de gobierno
    // Nota: en la tabla gobierno el campo se llama "contrasea" (sin "n")
    const [result] = await pool.query(
      `INSERT INTO gobierno (
        nombre_completo, 
        correo, 
        fecha_nacimiento, 
        telefono, 
        ciudad, 
        estado, 
        genero, 
        contrasea
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_completo, correo, fecha_nacimiento, telefono, ciudad, estado, genero, hashedPassword],
    )

    return NextResponse.json({
      success: true,
      message: "Usuario de gobierno registrado exitosamente",
    })
  } catch (error) {
    console.error("Error al registrar usuario de gobierno:", error)
    return NextResponse.json({ error: "Error en el servidor" }, { status: 500 })
  }
}

