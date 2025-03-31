export function EditModalContent() {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del documento</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            defaultValue="Identificación oficial"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de documento</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            defaultValue="INE"
          >
            <option value="INE">INE</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="CURP">CURP</option>
            <option value="Acta de nacimiento">Acta de nacimiento</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de expiración</label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            defaultValue="2028-10-15"
          />
        </div>
      </div>
    )
  }
  
  