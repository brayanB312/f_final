import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';

export async function POST(request: Request) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  try {
    // Process form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;
    const tipoDocumento = formData.get('tipoDocumento') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and user ID are required' },
        { status: 400 }
      );
    }

    // Create directory if needed
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Generate simple filename
    const timestamp = Date.now();
    const safeFilename = `${timestamp}_${file.name.replace(/[^\w.-]/g, '_')}`;
    const filePath = path.join(uploadDir, safeFilename);
    const buffer = Buffer.from(await file.arrayBuffer());
    
    await writeFile(filePath, buffer);

    // Database operation (clave_unica excluded)
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    try {
      await connection.execute(
        `INSERT INTO documentos 
         (usuario_id, nombre_original, ruta, tipo_documento) 
         VALUES (?, ?, ?, ?)`,
        [userId, file.name, `/uploads/${safeFilename}`, tipoDocumento]
      );

      return NextResponse.json({ 
        success: true,
        filePath: `/uploads/${safeFilename}`,
        fileInfo: {
          originalName: file.name,
          size: buffer.byteLength,
          type: file.type
        }
      });

    } finally {
      await connection.end();
    }

  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        error: 'Upload failed',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}