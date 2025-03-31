import { NextRequest, NextResponse } from "next/server";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import mysql from "mysql2/promise";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { ID, NOMBRE } = body;
    console.log("ID:", ID);
    console.log("NOMBRE:", NOMBRE);

    if (!ID) {
      return NextResponse.json(
        { error: "Falta el id_ciudadano" },
        { status: 400 }
      );
    }

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    const [familias] = await connection.execute(
      "SELECT * FROM familias WHERE Propietario = ?",
      [ID]
    );

    if ((familias as any[]).length === 0) {
      const [result] = await connection.execute(
        "INSERT INTO familias (Nombre, Propietario) VALUES (?, ?)",
        [`Familia de ${NOMBRE}`, ID]
      );
      const familiaId = (result as mysql.OkPacket).insertId;
      const [nuevaFamilia] = await connection.execute(
        "SELECT * FROM familias WHERE id = ?",
        [familiaId]
      );

      const [famiadd] = await connection.execute(
        "INSERT INTO famgen(id_fam, integrante, relacion) VALUES (?, ?, ?)",
        [familiaId, ID, "Propietario"]
      );
      console.log("Familia añadida:", famiadd);

      return NextResponse.json((nuevaFamilia as any[])[0], { status: 201 });
    }
    return NextResponse.json(familias, { status: 200 });
  } catch (error) {
    console.error("Error al obtener familias:", error);
    return NextResponse.json(
      { error: "Error al obtener familias" },
      { status: 500 }
    );
  }
}
