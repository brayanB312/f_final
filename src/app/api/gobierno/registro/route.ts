import { NextResponse } from "next/server"
import { pool } from "@/db/db"
import bcrypt from "bcrypt"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Extraer datos del cuerpo de la solicitud
    const {
      nombre_completo,
      correo,
      fecha_nacimiento,
      telefono,
      ciudad,
      estado,
      genero,
      contrasena
    } = body

    // Validar que todos los campos requeridos estén presentes
    if (
      !nombre_completo ||
      !correo ||
      !fecha_nacimiento ||
      !telefono ||
      !ciudad ||
      !estado ||
      !genero ||
      !contrasena
    ) {
      return NextResponse.json({ error: "Todos los campos son obligatorios" }, { status: 400 })
    }

    // Verificar si el correo ya existe
    const [existingUsers] = await pool.execute("SELECT id FROM gobierno WHERE correo = ?", [correo])

    // El resultado es un array, si tiene elementos, el correo ya existe
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      return NextResponse.json({ error: "El correo electrónico ya está registrado" }, { status: 409 })
    }

    // Verificar el código de validación (esto podría ser más complejo en producción)
    // Por ejemplo, podrías tener una tabla de códigos válidos o verificar contra un servicio externo

    // Encriptar la contraseña
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(contrasena, saltRounds)

    // Insertar el nuevo usuario en la base de datos
    const [result] = await pool.execute(
      `INSERT INTO gobierno 
       (nombre_completo, correo, fecha_nacimiento, telefono, ciudad, estado, genero, contrasea) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nombre_completo, correo, fecha_nacimiento, telefono, ciudad, estado, genero, hashedPassword],
    )

    // Obtener el ID del usuario recién insertado
    const userId = (result as any).insertId

    return NextResponse.json(
      {
        success: true,
        message: "Usuario de gobierno registrado con éxito",
        userId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error al registrar usuario de gobierno:", error)
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
  }
}

