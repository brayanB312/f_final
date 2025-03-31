export function ResumenCard({ titulo, valor, icono, color }) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} text-white mr-4`}>{icono}</div>
          <div>
            <p className="text-sm text-gray-500">{titulo}</p>
            <p className="text-2xl font-bold">{valor}</p>
          </div>
        </div>
      </div>
    )
  }
  
  