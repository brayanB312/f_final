"use client";
import { Download } from "lucide-react";

interface DownloadModalProps {
  documento: {
    id: string;
    nombre: string;
    rutaArchivo?: string;
  };
  onClose: () => void;
}

export function DownloadModalContent({ documento, onClose }: DownloadModalProps) {
  const handleDownload = () => {
    if (!documento.rutaArchivo) {
      alert("No hay archivo disponible para descargar");
      return;
    }

    // Construir la URL completa al archivo
    const fileUrl = `/uploads/${documento.rutaArchivo.split('/').pop()}`;
    
    // Crear un enlace temporal para la descarga
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = documento.nombre || 'documento';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    onClose();
  };

  return (
    <div className="space-y-4">
      <p>¿Estás seguro que deseas descargar el documento <strong>{documento.nombre}</strong>?</p>
      <div className="flex justify-end space-x-2">
        <button onClick={onClose}>
          Cancelar
        </button>
        <button onClick={handleDownload}>
          <Download className="mr-2 h-4 w-4" />
          Descargar
        </button>
      </div>
    </div>
  );
}