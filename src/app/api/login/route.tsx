import { NextResponse } from "next/server";
import mysql from "mysql2/promise";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [rows]: any = await connection.execute(
      "SELECT id, nombre_completo, contrasena FROM ciudadanos WHERE correo = ?",
      [email]
    );

    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ message: "Correo no registrado" }, { status: 401 });
    }

    const user = rows[0];

    const passwordMatch = await bcrypt.compare(password, user.contrasena);
    if (!passwordMatch) {
      return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 401 });
    }

    const response = NextResponse.json({
      message: "Inicio de sesión exitoso",
      user: {
        id: user.id,
        nombre_completo: user.nombre_completo,
      },
    });

    return response;

  } catch (error) {
    return NextResponse.json({ message: "Error en el servidor" }, { status: 500 });
  }
}