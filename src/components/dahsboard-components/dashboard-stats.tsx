import { FileText, CheckCircle, XCircle, Users } from "lucide-react"
import { ResumenCard } from "./ui/resumen-card"

export function DashboardStats({ documentos }) {
  const totalDocumentos = documentos.length
  const documentosValidados = documentos.filter((doc) => doc.estado === "Validado").length
  const documentosPendientes = totalDocumentos - documentosValidados
  const propietariosUnicos =
    documentos.length > 0 ? [...new Set(documentos.map((doc) => doc.propietario).filter(Boolean))].length : 0

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ResumenCard
        titulo="Total Documentos"
        valor={totalDocumentos}
        icono={<FileText className="w-5 h-5" />}
        color="bg-blue-500"
      />
      <ResumenCard
        titulo="Documentos Validados"
        valor={documentosValidados}
        icono={<CheckCircle className="w-5 h-5" />}
        color="bg-green-500"
      />
      <ResumenCard
        titulo="Pendientes de Validación"
        valor={documentosPendientes}
        icono={<XCircle className="w-5 h-5" />}
        color="bg-orange-500"
      />
      <ResumenCard
        titulo="Miembros Familiares"
        valor={propietariosUnicos}
        icono={<Users className="w-5 h-5" />}
        color="bg-purple-500"
      />
    </div>
  )
}

