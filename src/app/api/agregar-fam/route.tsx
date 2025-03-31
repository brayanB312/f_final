import { NextRequest, NextResponse } from "next/server";
import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { correo, relacion, userId } = body;
;        
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
        });

        
        const [familia] = await connection.execute(
            "SELECT id FROM familias WHERE Propietario = ?",
            [userId]
        );
        const familiaID = (familia as mysql.RowDataPacket[])[0]?.id;

        const [usuarioaagregar] = await connection.execute(
            "SELECT id FROM ciudadanos WHERE correo = ?",
            [correo]
        )
        const usuarioaagregarID = (usuarioaagregar as mysql.RowDataPacket[])[0]?.id;

        const [resultado] = await connection.execute(
            "INSERT INTO famgen (id_fam, integrante, relacion) VALUES (?, ?, ?)",
            [familiaID, usuarioaagregarID, relacion]
        );
        const familiaIDG = (resultado as mysql.OkPacket).insertId;
        console.log("Familia ID:", familiaIDG);
        return NextResponse.json(
            { message: "Familiar agregado con éxito", familiaIDG },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error al procesar la solicitud:", error);
        return NextResponse.json(
            { error: "Error al procesar la solicitud" },
            { status: 500 }
        );
    } finally {
        console.log("Solicitud procesada");
    }
}