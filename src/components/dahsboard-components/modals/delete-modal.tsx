export const DeleteModalContent = ({ onDelete, onClose }: { onDelete: () => void, onClose: () => void }) => {
  return (
    <div className="p-6">
      <h3 className="text-lg font-medium text-gray-900">¿Estás seguro de que quieres eliminar este documento?</h3>
      <div className="mt-4 flex justify-end space-x-2">
        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancelar</button>
        <button onClick={onDelete} className="px-4 py-2 bg-red-600 text-white rounded-md">Eliminar</button>
      </div>
    </div>
  );
};