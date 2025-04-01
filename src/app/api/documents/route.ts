import { NextResponse } from "next/server";
import mysql from "mysql2/promise";

interface Document {
  id: string;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  usuario_id: string;
  propietario_nombre: string;
  rutaArchivo: string;
  estado?: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  // Validación del userId
  if (!userId || !/^\d+$/.test(userId)) {
    return NextResponse.json<ErrorResponse>(
      { error: "Se requiere un ID de usuario válido" },
      { status: 400 }
    );
  }

  // Conexión a la base de datos
  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      connectTimeout: 10000,
    });

    // Consulta para obtener documentos con información del propietario
    const query = `
      SELECT 
        d.id,
        d.nombre_original AS nombre,
        d.tipo_documento AS tipo,
        DATE_FORMAT(d.creado_en, '%Y-%m-%d %H:%i:%s') AS fechaCreacion,
        d.usuario_id,
        c.nombre_completo AS propietario_nombre,
        d.ruta AS rutaArchivo
      FROM documentos d
      JOIN ciudadanos c ON d.usuario_id = c.id
      WHERE d.usuario_id = ?
      ORDER BY d.creado_en DESC
    `;

    const [documents] = await connection.execute<mysql.RowDataPacket[]>(query, [userId]);

    // Mapeo seguro de los resultados
    const formattedDocuments: Document[] = documents.map((doc) => ({
      id: String(doc.id),
      nombre: doc.nombre ? String(doc.nombre) : 'Sin nombre',
      tipo: doc.tipo ? String(doc.tipo) : 'Sin tipo',
      fechaCreacion: doc.fechaCreacion ? String(doc.fechaCreacion) : new Date().toISOString(),
      usuario_id: String(doc.usuario_id),
      propietario_nombre: doc.propietario_nombre ? String(doc.propietario_nombre) : 'Desconocido',
      rutaArchivo: doc.rutaArchivo ? String(doc.rutaArchivo) : ''
    }));

    return NextResponse.json(formattedDocuments);

  } catch (error) {
    console.error("Error en GET /api/documents:", error);
    return NextResponse.json<ErrorResponse>(
      {
        error: "Error al obtener documentos",
        details: error instanceof Error ? error.message : String(error)
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
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}