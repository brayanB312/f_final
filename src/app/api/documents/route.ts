import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface Document {
  id: string;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  propietario: number;
  rutaArchivo: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId || isNaN(Number(userId))) {
    return NextResponse.json<ErrorResponse>(
      { error: "User ID is required and must be a valid number" },
      { status: 400 }
    );
  }

  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
  const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);
  if (missingEnvVars.length > 0) {
    return NextResponse.json<ErrorResponse>(
      {
        error: "Database configuration missing",
        details: `Missing: ${missingEnvVars.join(", ")}`,
      },
      { status: 500 }
    );
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 5000,
    });

    const [familyIdResult] = await connection.execute<mysql.RowDataPacket[]>(
      `SELECT id_fam FROM famgen WHERE integrante = ?`,
      [userId]
    );
    const familyId = familyIdResult[0]?.id_fam || null;

    let documentsQuery = "";
    let queryParams = [];
    
    if (familyId) {
      documentsQuery = `
        SELECT d.id, d.nombre_original AS nombre, d.tipo_documento AS tipo,
               DATE_FORMAT(d.creado_en, '%Y-%m-%d %H:%i:%s') AS fechaCreacion,
               f.integrante AS propietario, d.ruta AS ruta
        FROM documentos d
        JOIN famgen f ON d.usuario_id = f.integrante
        WHERE f.id_fam = ?
        ORDER BY d.creado_en DESC`;
      queryParams = [familyId];
    } else {
      documentsQuery = `
        SELECT d.id, d.nombre_original AS nombre, d.tipo_documento AS tipo,
               DATE_FORMAT(d.creado_en, '%Y-%m-%d %H:%i:%s') AS fechaCreacion,
               d.usuario_id AS propietario, d.ruta AS ruta
        FROM documentos d
        WHERE d.usuario_id = ?
        ORDER BY d.creado_en DESC`;
      queryParams = [userId];
    }

    const [rows] = await connection.execute<mysql.RowDataPacket[]>(documentsQuery, queryParams);
    
    const documents: Document[] = rows.map((row) => ({
      id: String(row.id),
      nombre: String(row.nombre),
      tipo: String(row.tipo),
      fechaCreacion: String(row.fechaCreacion),
      propietario: Number(row.propietario),
      rutaArchivo: row.ruta, // Usamos directamente la ruta tal cual está en la base de datos
    }));
    

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json<ErrorResponse>(
      {
        error: "Failed to fetch documents",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    if (connection) await connection.end();
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
