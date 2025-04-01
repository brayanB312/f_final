"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Home } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nombre_completo: "",
    correo: "",
    fecha_nacimiento: "",
    telefono: "",
    ciudad: "",
    estado: "",
    genero: "",
    contrasena: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    // Validar que todos los campos estén presentes
    if (!formData.nombre_completo || !formData.correo || !formData.fecha_nacimiento || !formData.telefono || !formData.ciudad || !formData.estado || !formData.genero || !formData.contrasena) {
      setError("Todos los campos son obligatorios");
      setLoading(false);
      return;
    }
    
  
    try {
      const response = await fetch("/api/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
    } else {
        alert('Usuario registrado exitosamente');
        router.push("/login");
    }
} catch (error) {
    alert('Error en el servidor. Intente nuevamente.');
}
  
      
  };

  return (
  <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 lg:px-8 overflow-hidden">
    <Link
      href="/"
      className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
    >
      <Home className="h-5 w-5 text-gray-700" />
      <span className="sr-only">Ir al inicio</span>
    </Link>
    <div className="sm:mx-auto sm:w-full sm:max-w-sm">
      <img alt="Your Company" src="/logo.png" className="mx-auto h-10 w-auto" />
      <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Crea tu cuenta</h2>
    </div>

    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="nombre_completo" className="block text-sm font-medium text-gray-900">
            Nombre
          </label>
          <div className="mt-2">
            <input
              id="nombre_completo"
              name="nombre_completo"
              type="text"
              required
              placeholder="Tu nombre completo"
              value={formData.nombre_completo}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-900">
            Correo electrónico
          </label>
          <div className="mt-2">
            <input
              id="correo"
              name="correo"
              type="email"
              required
              autoComplete="email"
              placeholder="ejemplo@correo.com"
              value={formData.correo}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="fecha_nacimiento" className="block text-sm font-medium text-gray-900">
            Fecha de nacimiento
          </label>
          <div className="mt-2">
            <input
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              type="date"
              required
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="telefono" className="block text-sm font-medium text-gray-900">
            Número de teléfono
          </label>
          <div className="mt-2">
            <input
              id="telefono"
              name="telefono"
              type="tel"
              required
              placeholder="+52 686 234 5678"
              value={formData.telefono}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="ciudad" className="block text-sm font-medium text-gray-900">
              Ciudad
            </label>
            <div className="mt-2">
              <input
                id="ciudad"
                name="ciudad"
                type="text"
                required
                placeholder="Tu ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label htmlFor="estado" className="block text-sm font-medium text-gray-900">
              Estado/Provincia
            </label>
            <div className="mt-2">
              <select
                id="estado"
                name="estado"
                required
                value={formData.estado}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
              >
                <option value="">Selecciona un estado</option>
                <option value="aguascalientes">Aguascalientes</option>
                <option value="baja-california">Baja California</option>
                <option value="baja-california-sur">Baja California Sur</option>
                <option value="campeche">Campeche</option>
                <option value="chiapas">Chiapas</option>
                <option value="chihuahua">Chihuahua</option>
                <option value="coahuila">Coahuila</option>
                <option value="colima">Colima</option>
                <option value="durango">Durango</option>
                <option value="estado-de-mexico">Estado de México</option>
                <option value="guanajuato">Guanajuato</option>
                <option value="guerrero">Guerrero</option>
                <option value="hidalgo">Hidalgo</option>
                <option value="jalisco">Jalisco</option>
                <option value="michoacan">Michoacán</option>
                <option value="morelos">Morelos</option>
                <option value="nayarit">Nayarit</option>
                <option value="nuevo-leon">Nuevo León</option>
                <option value="oaxaca">Oaxaca</option>
                <option value="puebla">Puebla</option>
                <option value="queretaro">Querétaro</option>
                <option value="quintana-roo">Quintana Roo</option>
                <option value="san-luis-potosi">San Luis Potosí</option>
                <option value="sinaloa">Sinaloa</option>
                <option value="sonora">Sonora</option>
                <option value="tabasco">Tabasco</option>
                <option value="tamaulipas">Tamaulipas</option>
                <option value="tlaxcala">Tlaxcala</option>
                <option value="veracruz">Veracruz</option>
                <option value="yucatan">Yucatán</option>
                <option value="zacatecas">Zacatecas</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="genero" className="block text-sm font-medium text-gray-900">
            Género
          </label>
          <div className="mt-2">
            <select
              id="genero"
              name="genero"
              required
              value={formData.genero}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            >
              <option value="">Selecciona una opción</option>
              <option value="Masculino">Masculino</option>
              <option value="Femenino">Femenino</option>
              <option value="Otro">Otro</option>
              <option value="Prefiero no decirlo">Prefiero no decirlo</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="contrasena" className="block text-sm font-medium text-gray-900">
            Contraseña
          </label>
          <div className="mt-2">
            <input
              id="contrasena"
              name="contrasena"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Crea una contraseña"
              value={formData.contrasena}
              onChange={handleChange}
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="confirmar_contrasena" className="block text-sm font-medium text-gray-900">
            Confirmar contraseña
          </label>
          <div className="mt-2">
            <input
              id="confirmar_contrasena"
              name="confirmar_contrasena"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Confirma tu contraseña"
              className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-indigo-600 sm:text-sm"
            />
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-900">
              Acepto los{" "}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                términos y condiciones
              </a>{" "}
              y la{" "}
              <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                política de privacidad
              </a>
            </label>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-blue-600 transition transform hover:scale-105"
          >
            Registrarse
          </button>
        </div>
      </form>
      <p className="mt-4 pb-4 text-center text-sm text-gray-600">
        ¿Ya tienes una cuenta?{" "}
        <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Inicia sesión aquí
        </Link>
      </p>
    </div>
  </div>

  );
}
