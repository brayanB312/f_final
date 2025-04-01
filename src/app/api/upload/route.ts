import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    // Procesar solo los datos necesarios
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const tipoDocumento = formData.get('tipoDocumento') as string;

    // Validaciones básicas
    if (!file) {
      return NextResponse.json(
        { error: 'El archivo es requerido' },
        { status: 400 }
      );
    }

    if (!userId || !tipoDocumento) {
      return NextResponse.json(
        { error: 'ID de usuario y tipo de documento son requeridos' },
        { status: 400 }
      );
    }

    // Crear directorio si no existe
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generar nombre de archivo único
    const timestamp = Date.now();
    const safeFilename = `${userId}_${timestamp}_${file.name.replace(/[^\w.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Guardar archivo físicamente
    await writeFile(filePath, buffer);

    // Conexión a MySQL para guardar registro
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    try {
      // Insertar en tabla 'documentos' (sin campos de admin)
      const [result]: any = await connection.execute(
        `INSERT INTO documentos 
         (usuario_id, nombre_original, ruta, tipo_documento, estado) 
         VALUES (?, ?, ?, ?, 'pendiente')`,
        [userId, file.name, `/uploads/${safeFilename}`, tipoDocumento]
      );

      // Devolver respuesta exitosa
      return NextResponse.json({ 
        success: true,
        documento: {
          id: result.insertId,
          nombre_original: file.name,
          ruta: `/uploads/${safeFilename}`,
          tipo_documento: tipoDocumento,
          estado: 'pendiente'
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error: any) {
    console.error('Error en la subida:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Error al subir el documento',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}