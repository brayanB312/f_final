"use client"

export function EmptyState({ message, icon, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="bg-gray-100 p-4 rounded-full mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
      <p className="text-sm text-gray-500 max-w-md mb-4">{message}</p>
      {actionText && (
        <button
          onClick={onAction}
          className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90"
        >
          {icon && <span className="h-4 w-4 mr-2 inline-block">{icon}</span>}
          {actionText}
        </button>
      )}
    </div>
  )
}

