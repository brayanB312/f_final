"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

// Interfaz para los datos del formulario
interface RegisterFormData {
  nombre_completo: string
  correo: string
  fecha_nacimiento: string
  telefono: string
  ciudad: string
  estado: string
  genero: string
  contrasena: string

}

// Lista de estados de México para el select
const ESTADOS_MEXICO = [
  { value: "aguascalientes", label: "Aguascalientes" },
  { value: "baja-california", label: "Baja California" },
  { value: "baja-california-sur", label: "Baja California Sur" },
  { value: "campeche", label: "Campeche" },
  { value: "chiapas", label: "Chiapas" },
  { value: "chihuahua", label: "Chihuahua" },
  { value: "coahuila", label: "Coahuila" },
  { value: "colima", label: "Colima" },
  { value: "durango", label: "Durango" },
  { value: "estado-de-mexico", label: "Estado de México" },
  { value: "guanajuato", label: "Guanajuato" },
  { value: "guerrero", label: "Guerrero" },
  { value: "hidalgo", label: "Hidalgo" },
  { value: "jalisco", label: "Jalisco" },
  { value: "michoacan", label: "Michoacán" },
  { value: "morelos", label: "Morelos" },
  { value: "nayarit", label: "Nayarit" },
  { value: "nuevo-leon", label: "Nuevo León" },
  { value: "oaxaca", label: "Oaxaca" },
  { value: "puebla", label: "Puebla" },
  { value: "queretaro", label: "Querétaro" },
  { value: "quintana-roo", label: "Quintana Roo" },
  { value: "san-luis-potosi", label: "San Luis Potosí" },
  { value: "sinaloa", label: "Sinaloa" },
  { value: "sonora", label: "Sonora" },
  { value: "tabasco", label: "Tabasco" },
  { value: "tamaulipas", label: "Tamaulipas" },
  { value: "tlaxcala", label: "Tlaxcala" },
  { value: "veracruz", label: "Veracruz" },
  { value: "yucatan", label: "Yucatán" },
  { value: "zacatecas", label: "Zacatecas" },
]

// Opciones de género
const OPCIONES_GENERO = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
  { value: "No binario", label: "No binario" },
  { value: "Otro", label: "Otro" },
  { value: "Prefiero no decirlo", label: "Prefiero no decirlo" },
]

export default function RegisterGobierno() {
  const router = useRouter()

  // Estado inicial del formulario
  const [formData, setFormData] = useState<RegisterFormData>({
    nombre_completo: "",
    correo: "",
    fecha_nacimiento: "",
    telefono: "",
    ciudad: "",
    estado: "",
    genero: "",
    contrasena: "",

  })

  // Estados para controlar la UI
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [passwordsMatch, setPasswordsMatch] = useState(true)

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Verificar si las contraseñas coinciden cuando se modifica la contraseña
    if (name === "contrasena") {
      setPasswordsMatch(confirmPassword === "" || value === confirmPassword)
    }
  }

  // Manejar cambio en la confirmación de contraseña
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setConfirmPassword(value)
    setPasswordsMatch(value === formData.contrasena)
  }

  // Manejar cambio en los términos y condiciones
  const handleTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTermsAccepted(e.target.checked)
  }

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validaciones
    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden")
      return
    }

    if (!termsAccepted) {
      setError("Debe aceptar los términos y condiciones")
      return
    }



    // Validar que todos los campos estén presentes
    const requiredFields = Object.entries(formData).filter(([_, value]) => !value)
    if (requiredFields.length > 0) {
      setError(`Todos los campos son obligatorios`)
      return
    }

    setLoading(true)
    setError("")

    try {
      // Enviar datos al servidor
      const response = await fetch("/api/gobierno/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Registro exitoso
        alert("Usuario de gobierno registrado con éxito!")
        router.push("/sesiongobierno")
      } else {
        // Error en el registro
        setError(data.error || "Error en el registro")
      }
    } catch (err) {
      console.error("Error al registrar usuario de gobierno:", err)
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12 lg:px-8 overflow-hidden bg-gray-50">
      <Link
        href="/"
        className="absolute top-4 left-4 p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-gray-700"
        >
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="sr-only">Ir al inicio</span>
      </Link>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img alt="Logo" src="/logo.png" className="mx-auto h-10 w-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
          Crea tu cuenta de Gobierno
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">Registro exclusivo para funcionarios de gobierno</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre completo */}
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Correo electrónico */}
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
                placeholder="ejemplo@gobierno.gob.mx"
                value={formData.correo}
                onChange={handleChange}
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Fecha de nacimiento */}
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Número de teléfono */}
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Ciudad y Estado */}
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
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
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
                  className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-blue-600 sm:text-sm"
                >
                  <option value="">Selecciona un estado</option>
                  {ESTADOS_MEXICO.map((estado) => (
                    <option key={estado.value} value={estado.value}>
                      {estado.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Género */}
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              >
                <option value="">Selecciona una opción</option>
                {OPCIONES_GENERO.map((opcion) => (
                  <option key={opcion.value} value={opcion.value}>
                    {opcion.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Código de validación */}

          {/* Contraseña */}
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
                className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border border-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm"
              />
            </div>
          </div>

          {/* Confirmar contraseña */}
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
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 border ${
                  !passwordsMatch && confirmPassword ? "border-red-500" : "border-gray-300"
                } placeholder:text-gray-400 focus:outline-2 focus:outline-blue-600 sm:text-sm`}
              />
              {!passwordsMatch && confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Las contraseñas no coinciden</p>
              )}
            </div>
          </div>

          {/* Términos y condiciones */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={termsAccepted}
                onChange={handleTermsChange}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="terms" className="font-medium text-gray-900">
                Acepto los{" "}
                <a href="/terms" className="text-blue-600 hover:text-blue-500">
                  términos y condiciones
                </a>{" "}
                y la{" "}
                <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                  política de privacidad
                </a>
              </label>
            </div>
          </div>

          {/* Botón de registro */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-green-500 focus-visible:outline-2 focus-visible:outline-green-600 transition transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando..." : "Registrarse como Gobierno"}
            </button>
          </div>
        </form>

        <div className="mt-6 space-y-2">
          <p className="text-center text-sm text-gray-600">
            ¿Ya tienes una cuenta de gobierno?{" "}
            <Link href="/sesiongobierno" className="font-semibold text-green-600 hover:text-green-500">
              Inicia sesión aquí
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

