"use client"
import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import 'react-pdf/dist/esm/Page/AnnotationLayer.css'
import 'react-pdf/dist/esm/Page/TextLayer.css'

// Configuración esencial para PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.7.570/build/pdf.worker.min.js';

interface ViewModalContentProps {
  documento: {
    id: string
    nombre: string
    tipo: string
    fechaCreacion: string
    propietario: string
    rutaArchivo?: string
    contenido?: string
  } | null
  onClose: () => void
}

export function ViewModalContent({ documento, onClose }: ViewModalContentProps) {
  const [numPages, setNumPages] = useState<number | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1.0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  if (!documento) {
    return (
      <div className="p-4">
        <p>Documento no encontrado</p>
        <button onClick={onClose}>Cerrar</button>
      </div>
    )
  }

  console.log("Ruta del archivo:", documento.rutaArchivo)
  const fileUrl = documento.rutaArchivo ? `/uploads/${documento.rutaArchivo}` : null

  return (
    <div className="p-4 max-h-[90vh] flex flex-col">
      <h2 className="text-xl font-bold mb-4">{documento.nombre}</h2>
      
      {fileUrl ? (
        <div className="flex-1 overflow-auto border rounded-lg">
          {fileUrl.endsWith('.pdf') ? (
            <>
              <div className="flex gap-2 mb-2 p-2 bg-gray-50">
                <button 
                  onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
                  className="px-2 py-1 border rounded"
                >
                  -
                </button>
                <span className="px-2 py-1">{(scale * 100).toFixed(0)}%</span>
                <button 
                  onClick={() => setScale(prev => Math.min(2, prev + 0.1))}
                  className="px-2 py-1 border rounded"
                >
                  +
                </button>
              </div>
              
              <Document
                file={fileUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={<div className="p-8 text-center">Cargando PDF...</div>}
                error={<div className="p-8 text-center text-red-500">Error al cargar el PDF</div>}
                noData={<div className="p-8 text-center">PDF no disponible</div>}
              >
                <Page 
                  pageNumber={pageNumber} 
                  width={800 * scale}
                  renderTextLayer={false}
                  className="border-b"
                />
              </Document>

              {numPages && (
                <div className="flex items-center justify-center gap-4 p-2 bg-gray-50">
                  <button
                    disabled={pageNumber <= 1}
                    onClick={() => setPageNumber(prev => prev - 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {pageNumber} de {numPages}
                  </span>
                  <button
                    disabled={pageNumber >= numPages}
                    onClick={() => setPageNumber(prev => prev + 1)}
                    className="px-3 py-1 border rounded disabled:opacity-50"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-4 flex flex-col items-center">
              <p className="mb-4">Este tipo de archivo no se puede previsualizar</p>
              <a
                href={fileUrl}
                download
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Descargar archivo
              </a>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-yellow-50 text-yellow-700 p-4 rounded-md mb-4">
          <p>No hay archivo asociado a este documento</p>
          {documento.contenido && (
            <div className="mt-2 bg-white p-3 rounded">
              <p className="font-medium">Contenido textual:</p>
              <pre className="whitespace-pre-wrap">{documento.contenido}</pre>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <p className="text-sm text-gray-500">Tipo de documento</p>
          <p className="font-medium">{documento.tipo}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Fecha de creación</p>
          <p className="font-medium">
            {new Date(documento.fechaCreacion).toLocaleDateString()}
          </p>
        </div>
      </div>

      <button onClick={onClose} className="w-full mt-4">
        Cerrar
      </button>
    </div>
  )
}
