import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { UserPlus, X, Loader2 } from 'lucide-react';

interface FamilyMember {
  email: string;
  relationship: string;
  status?: 'pending' | 'accepted';
}

export function FamilyModalContent() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [relationship, setRelationship] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [familyName, setFamilyName] = useState('');
  const [user, setUser] = useState({ id: '', nombre_completo: '' });
  const [members, setMembers] = useState<FamilyMember[]>([]);
  const [isCreatingFamily, setIsCreatingFamily] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

      if (!userId || !userName) {
        router.push("/login");
      } else {
        setUser({ id: userId, nombre_completo: userName });
        // Opcional: cargar miembros existentes si estamos editando
      }
    }
  }, []);

  const addMember = () => {
    if (!email || !relationship) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor ingresa un correo electrónico válido');
      return;
    }

    // Verificar si el miembro ya fue agregado
    if (members.some(m => m.email === email)) {
      setError('Este correo electrónico ya fue agregado');
      return;
    }

    setError('');
    setMembers([...members, { email, relationship, status: 'pending' }]);
    setEmail('');
    setRelationship('');
  };

  const removeMember = (emailToRemove: string) => {
    setMembers(members.filter(m => m.email !== emailToRemove));
  };

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');
  
    try {
      if (members.length === 0) {
        throw new Error('Debes agregar al menos un miembro a la familia');
      }
  
      if (!familyName.trim()) {
        throw new Error('Por favor ingresa un nombre para la familia');
      }
  
      const response = await fetch('/api/families', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          familyName,
          members,
          adminId: user.id
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear la familia');
      }
  
      setSuccess('Familia creada exitosamente!');
      setFamilyName('');
      setMembers([]);
      
    } catch (err) {
      console.error('Error:', err);
      // Manejo seguro del tipo unknown
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === 'string') {
        setError(err);
      } else {
        setError('Ocurrió un error desconocido al crear la familia');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Crear nueva familia
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Agrega miembros a tu familia y comparte documentos con ellos.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">{success}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="family-name" className="block text-sm font-medium text-gray-700">
          Nombre de la familia
        </label>
        <input
          type="text"
          id="family-name"
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          value={familyName}
          onChange={(e) => setFamilyName(e.target.value)}
          placeholder="Ej: Familia Pérez"
        />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              placeholder="Ej: familiar@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Relación
            </label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Seleccionar relación</option>
              <option value="Esposo/a">Esposo/a</option>
              <option value="Hijo/a">Hijo/a</option>
              <option value="Padre/Madre">Padre/Madre</option>
              <option value="Hermano/a">Hermano/a</option>
              <option value="Abuelo/a">Abuelo/a</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={addMember}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={!email || !relationship}
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Agregar miembro
        </button>
      </div>

      {members.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-700">Miembros agregados:</h4>
          <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md">
            {members.map((member, index) => (
              <li key={index} className="py-3 px-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">{member.email}</p>
                  <p className="text-xs text-gray-500">{member.relationship}</p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMember(member.email)}
                  className="text-red-600 hover:text-red-900"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          // onClick={closeModal} // Deberías pasar esta función como prop
        >
          Cancelar
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isLoading || members.length === 0 || !familyName.trim()}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Creando...
            </>
          ) : (
            'Crear familia'
          )}
        </button>
      </div>
    </div>
  );
}