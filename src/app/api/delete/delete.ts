import type { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '@/db/db'; // Asegúrate de tener configurado tu pool de MySQL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;
  const { id } = req.query;

  switch (method) {
    case 'DELETE':
      if (!id) {
        return res.status(400).json({ message: 'ID de documento no proporcionado' });
      }

      try {
        // Primero, obtenemos el documento de la base de datos (opcional, para asegurarse de que existe)
        const [document] = await pool.execute('SELECT * FROM documentos WHERE id = ?', [id]);

        // El resultado de la consulta es de tipo [QueryResult, FieldPacket[]], por lo que necesitamos acceder correctamente
        const documento = document as { id: number; rutaArchivo: string }[]; // Se asume que la tabla tiene 'id' y 'rutaArchivo'

        if (documento.length === 0) {
          return res.status(404).json({ message: 'Documento no encontrado' });
        }

        // Elimina el archivo físico si es necesario
        if (documento[0].rutaArchivo) {
          const fs = require('fs');
          const path = require('path');
          const filePath = path.resolve('public', documento[0].rutaArchivo);

          console.log(filePath); // Agrega esta línea para ver la ruta completa del archivo


          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Eliminar el archivo
          }
        }

        // Ahora, eliminamos el documento de la base de datos
        const [result] = await pool.execute('DELETE FROM documentos WHERE id = ?', [id]);

        // El resultado de la consulta es también de tipo [QueryResult, FieldPacket[]], por lo que necesitamos acceder correctamente
        const resDelete = result as { affectedRows: number };

        if (resDelete.affectedRows === 0) {
          return res.status(404).json({ message: 'No se pudo eliminar el documento' });
        }

        return res.status(200).json({ message: 'Documento eliminado con éxito' });
      } catch (error) {
        console.error('Error al eliminar documento:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
      }

    default:
      return res.status(405).json({ message: 'Método no permitido' });
  }
}
