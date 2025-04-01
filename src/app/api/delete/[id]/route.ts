import { type NextRequest, NextResponse } from "next/server"
import { pool } from "@/db/db"
import fs from "fs"
import path from "path"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id

  if (!id) {
    return NextResponse.json({ message: "ID de documento no proporcionado" }, { status: 400 })
  }

  try {
    // Primero, obtenemos el documento de la base de datos
    const [document] = await pool.execute("SELECT * FROM documentos WHERE id = ?", [id])

    // El resultado de la consulta es de tipo [QueryResult, FieldPacket[]]
    const documento = document as { id: number; rutaArchivo: string }[]

    if (documento.length === 0) {
      return NextResponse.json({ message: "Documento no encontrado" }, { status: 404 })
    }

    // Elimina el archivo físico si es necesario
    if (documento[0].rutaArchivo) {
      const filePath = path.resolve("public", documento[0].rutaArchivo)

      console.log(filePath) // Agrega esta línea para ver la ruta completa del archivo

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath) // Eliminar el archivo
      }
    }

    // Ahora, eliminamos el documento de la base de datos
    const [result] = await pool.execute("DELETE FROM documentos WHERE id = ?", [id])

    // El resultado de la consulta es también de tipo [QueryResult, FieldPacket[]]
    const resDelete = result as { affectedRows: number }

    if (resDelete.affectedRows === 0) {
      return NextResponse.json({ message: "No se pudo eliminar el documento" }, { status: 404 })
    }

    return NextResponse.json({ message: "Documento eliminado con éxito" })
  } catch (error) {
    console.error("Error al eliminar documento:", error)
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

