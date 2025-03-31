import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface Document {
  id: string;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  propietario: string;
  rutaArchivo: string; // Ruta del archivo
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(request: Request) {
  // 1. Extraer y validar el userId
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  console.log("🔍 User ID recibido:", userId);

  if (!userId) {
    return NextResponse.json<ErrorResponse>(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  // 2. Validar las variables de entorno de la base de datos
  const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_NAME"];
  const missingEnvVars = requiredEnvVars.filter((env) => !process.env[env]);

  if (missingEnvVars.length > 0) {
    console.error("❌ Error: Faltan variables de entorno", missingEnvVars);
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

    // 3. Obtener el id_fam de la familia del integrante
    const [familyIdResult] = await connection.execute<mysql.RowDataPacket[]>(`
      SELECT id_fam FROM famgen WHERE integrante = ?
    `, [userId]);

    // Acceder al id_fam del primer objeto
    const familyId = familyIdResult[0]?.id_fam;

    if (!familyId) {
      return NextResponse.json<ErrorResponse>(
        { error: "Family ID not found for this user" },
        { status: 404 }
      );
    }

    console.log("ID de familia obtenido:", familyId);

    // 4. Obtener todos los documentos de los integrantes de la familia
    const [rows] = await connection.execute<mysql.RowDataPacket[]>(`
      SELECT 
          d.id,
          d.nombre_original AS nombre,
          d.tipo_documento AS tipo,
          DATE_FORMAT(d.creado_en, '%Y-%m-%d %H:%i:%s') AS fechaCreacion,
          f.integrante AS propietario,
          d.ruta AS ruta
      FROM documentos d
      JOIN famgen f ON d.usuario_id = f.integrante
      WHERE f.id_fam = ?  -- Filtramos por la familia del usuario
      ORDER BY d.creado_en DESC
    `, [familyId]);

    console.log("Documentos obtenidos de la BD:", rows);

    // 5. Conversión de tipo y validación de los documentos
    const documents: Document[] = rows.map((row: any) => {
      // Validar que existan los campos requeridos
      if (
        !row.id ||
        !row.nombre ||
        !row.tipo ||
        !row.fechaCreacion ||
        !row.propietario ||
        !row.ruta
      ) {
        throw new Error("Missing required document fields");
      }

      return {
        id: String(row.id),
        nombre: String(row.nombre),
        tipo: String(row.tipo),
        fechaCreacion: String(row.fechaCreacion),
        propietario: String(row.propietario),
        rutaArchivo: `/uploads/${row.ruta}`, // Ruta del archivo en la carpeta pública
      };
    });

    return NextResponse.json(documents);
  } catch (error) {
    console.error("Database error:", error);
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
