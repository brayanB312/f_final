import React, { useEffect, useState } from 'react'
import { useRouter } from "next/navigation";

export function FamilyModalContent() {
  const router = useRouter();
  const [correo, setCorreo] = useState('');
  const [relacion, setRelacion] = useState('');
  const [error, setError] = useState('');
  const [user, setUser] = useState({ id: '', nombre_completo: '' });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

      console.log("🔍 Intentando obtener User ID desde localStorage:", userId);
      if (!userId || !userName) {
        router.push("/login");
      } else {
        setUser({ id: userId, nombre_completo: userName });
      }
    }
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    fetch('/api/agregar-fam', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo, relacion, userId: user?.id }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error en la solicitud')
        }
        return response.json()
      })
      .then((data) => {
        console.log('Respuesta del servidor:', data)
        if (data.success) {
          alert('Formulario enviado con éxito')
          setCorreo('')
          setRelacion('')
        } else {
          setError(data.message || 'Hubo un error al enviar el formulario.')
        }
      })
      .catch((error) => {
        console.error('Error:', error)
        setError('Hubo un error al enviar el formulario. Inténtalo de nuevo más tarde.')
      })
  }

  return (
    <form className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
        <input
          type="email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
          placeholder="Ej: familiar@ejemplo.com"
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Relación</label>
        <select onChange={(e) => setRelacion(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary">
          <option value="">Seleccionar relación</option>
          <option value="Esposo/a">Esposo/a</option>
          <option value="Hijo/a">Hijo/a</option>
          <option value="Padre/Madre">Padre/Madre</option>
          <option value="Hermano/a">Hermano/a</option>
          <option value="Abuelo/a">Abuelo/a</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          onClick={handleSubmit}
        >
          Enviar
        </button>
      </div>
    </form>
  )
}
