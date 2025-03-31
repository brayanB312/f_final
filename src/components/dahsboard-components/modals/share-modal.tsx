export function ShareModalContent() {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Documento a compartir</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar documento</option>
            <option value="doc-001">Identificación oficial</option>
            <option value="doc-002">Certificado de nacimiento</option>
            <option value="doc-003">CURP</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Compartir con</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar familiar</option>
            <option value="fam-001">María Rodríguez</option>
            <option value="fam-002">Carlos López</option>
            <option value="fam-003">Ana López</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          />
        </div>
        <div>
          <label className="flex items-center">
            <input type="checkbox" className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary" />
            <span className="ml-2 text-sm text-gray-600">Permitir descarga</span>
          </label>
        </div>
      </div>
    )
  }
  
  