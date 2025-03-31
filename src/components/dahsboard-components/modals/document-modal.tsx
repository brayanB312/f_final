"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function DocumentModalContent() {
  const [nombre, setNombre] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const router = useRouter();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !tipoDocumento || !file) {
      alert('Por favor complete todos los campos');
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('tipoDocumento', tipoDocumento);
      formData.append('file', file);
      formData.append('userId', localStorage.getItem('userId') || '');
      formData.append('claveUnica', Date.now().toString()); // Using timestamp as unique key

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir el documento');
      } else {
        alert("El documento se ha subido correctamente");
      };

      router.refresh(); // Refresh to show new document
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error al subir el documento');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del documento
        </label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Ej: Identificación oficial"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de documento
        </label>
          <select 
            value={tipoDocumento}
            onChange={(e) => setTipoDocumento(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Seleccionar tipo de documento</option>

            {/* Identificación Oficial */}
            <optgroup label="Identificación Oficial">
              <option value="INE/IFE">INE/IFE</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="Cédula Profesional">Cédula Profesional</option>
              <option value="Cartilla Militar">Cartilla Militar</option>
              <option value="Licencia de Conducir">Licencia de Conducir</option>
            </optgroup>

            {/* Documentos Personales */}
            <optgroup label="Documentos Personales">
              <option value="Acta de Nacimiento">Acta de Nacimiento</option>
              <option value="CURP">CURP (Clave Única de Registro de Población)</option>
              <option value="RFC">RFC (Registro Federal de Contribuyentes)</option>
              <option value="Comprobante de Domicilio">Comprobante de Domicilio</option>
            </optgroup>

            {/* Documentos Migratorios */}
            <optgroup label="Documentos Migratorios">
              <option value="FM2/FM3">Forma Migratoria Múltiple (FM2/FM3)</option>
              <option value="Visa Residente">Visa de Residente Permanente</option>
              <option value="Visa Temporal">Visa Temporal</option>
            </optgroup>

            {/* Documentos Académicos */}
            <optgroup label="Documentos Académicos">
              <option value="Certificado de Estudios">Certificado de Estudios</option>
              <option value="Título Profesional">Título Profesional</option>
              <option value="Diploma">Diploma</option>
            </optgroup>

            {/* Documentos Financieros */}
            <optgroup label="Documentos Financieros">
              <option value="Estado de Cuenta">Estado de Cuenta Bancario</option>
              <option value="Comprobante de Ingresos">Comprobante de Ingresos</option>
              <option value="Declaración Fiscal">Declaración Fiscal</option>
            </optgroup>
          </select>
      </div>

      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Archivo
        </label>
        <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 ${dragActive ? 'border-primary' : 'border-gray-300'} border-dashed rounded-md`}>
          <div className="space-y-1 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div className="flex text-sm text-gray-600">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
              >
                <span>Subir un archivo</span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="sr-only" 
                  onChange={handleFileChange}
                  accept="pdf"
                />
              </label>
              <p className="pl-1">o arrastrar y soltar</p>
            </div>
            <p className="text-xs text-gray-500">
              {file ? (
                <span className="font-medium">{file.name} ({Math.round(file.size / 1024)} KB)</span>
              ) : (
                "PDF hasta 10MB"
              )}
            </p>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isUploading}
        className="
              w-full 
              py-3 px-6 
              text-lg font-medium
              bg-primary text-black
              rounded-lg
              border border-gray-300
              hover:bg-primary/90 cursor-pointer
              focus:outline-none focus:ring-4 focus:ring-primary/50
              active:bg-primary-dark 
              transition-all duration-200
              disabled:opacity-70 disabled:cursor-not-allowed
              relative overflow-hidden
        "
      >
        {isUploading ? 'Subiendo...' : 'Guardar Documento'}
      </button>
    </form>
  );
}