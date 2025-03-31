export function FamilyModalContent() {
    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ej: María Rodríguez"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relación</label>
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary">
            <option value="">Seleccionar relación</option>
            <option value="Esposo/a">Esposo/a</option>
            <option value="Hijo/a">Hijo/a</option>
            <option value="Padre/Madre">Padre/Madre</option>
            <option value="Hermano/a">Hermano/a</option>
            <option value="Abuelo/a">Abuelo/a</option>
            <option value="Otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
          <input
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ej: familiar@ejemplo.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
          <input
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            placeholder="Ej: +52 555 123 4567"
          />
        </div>
      </div>
    )
  }
  
  