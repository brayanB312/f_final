"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginGobierno() {
  // Estados para el formulario
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Estado para el tema
  const [isDarkMode, setIsDarkMode] = useState(false)

  const router = useRouter()

  // Función para cambiar tema claro/oscuro
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    // Aplicar clase dark al elemento html
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  // Función para manejar el inicio de sesión
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Por favor ingrese usuario y contraseña")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/loginGob", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: username,
          contrasena: password,
          remember: rememberMe,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem("userId", data.userId)
        localStorage.setItem("userName", data.userName)
        localStorage.setItem("userRole", "gobierno")

        // Redirigir al panel de gobierno
        router.push("/paneldegobierno")
      } else {
        setError(data.error || "Credenciales inválidas")
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err)
      setError("Error de conexión con el servidor")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? "dark bg-slate-900" : "bg-slate-50"} flex flex-col`}>
      {/* Header - Simplified version */}
      <header className={`border-b ${isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"}`}>
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Logo Panel de Gobierno" width={32} height={32} />
            <h1 className={`text-lg md:text-xl font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Panel de Gobierno
            </h1>
          </div>

          {/* Header right buttons */}
          <div className="flex items-center gap-2">
            {/* Home button */}
            <Link href="/">
              <button
                className={`p-2 rounded-full ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
                title="Regresar a inicio"
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
                  className={isDarkMode ? "text-white" : "text-gray-700"}
                >
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="sr-only">Regresar a inicio</span>
              </button>
            </Link>

            {/* Theme Toggle */}
            <button
              className={`p-2 rounded-full ${isDarkMode ? "hover:bg-slate-700" : "hover:bg-slate-100"}`}
              onClick={toggleTheme}
              title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDarkMode ? (
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
                  className="text-white"
                >
                  <circle cx="12" cy="12" r="4"></circle>
                  <path d="M12 2v2"></path>
                  <path d="M12 20v2"></path>
                  <path d="m4.93 4.93 1.41 1.41"></path>
                  <path d="m17.66 17.66 1.41 1.41"></path>
                  <path d="M2 12h2"></path>
                  <path d="M20 12h2"></path>
                  <path d="m6.34 17.66-1.41 1.41"></path>
                  <path d="m19.07 4.93-1.41 1.41"></path>
                </svg>
              ) : (
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
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
                </svg>
              )}
              <span className="sr-only">Cambiar tema</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Login Form */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div
          className={`w-full max-w-md rounded-lg border shadow-sm p-6 ${
            isDarkMode ? "bg-slate-800 border-slate-700" : "bg-white"
          }`}
        >
          <div className="space-y-1 text-center mb-6">
            <div className="flex justify-center mb-4">
              <div className={`rounded-full p-3 ${isDarkMode ? "bg-green-900/20" : "bg-green-100"}`}>
                <img
                  src="/logo.png"
                  alt="Logo Panel de Gobierno"
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain"
                />
              </div>
            </div>
            <h2 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>
              Acceso Gubernamental
            </h2>
            <p className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
              Ingrese sus credenciales para acceder al panel de gobierno
            </p>
          </div>

          {error && <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
              >
                Usuario
              </label>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-gray-400">
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
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingrese su correo electrónico"
                  className={`pl-10 w-full rounded-md border px-3 py-2 text-sm ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  }`}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className={`text-sm font-medium ${isDarkMode ? "text-white" : "text-gray-900"}`}
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  className={`text-xs ${isDarkMode ? "text-green-400" : "text-green-600"} hover:underline`}
                >
                  ¿Olvidó su contraseña?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-2.5 text-gray-400">
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
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese su contraseña"
                  className={`pl-10 w-full rounded-md border px-3 py-2 text-sm ${
                    isDarkMode
                      ? "bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
                      : "bg-white border-gray-300 text-gray-900 placeholder:text-gray-400"
                  }`}
                />
                <button
                  type="button"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
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
                    >
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                      <line x1="2" x2="22" y1="2" y2="22"></line>
                    </svg>
                  ) : (
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
                    >
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                  <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="remember"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`h-4 w-4 rounded border ${isDarkMode ? "border-slate-600" : "border-gray-300"} ${isDarkMode ? "text-green-500" : "text-green-600"}`}
              />
              <label htmlFor="remember" className={`text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                Recordar mis credenciales
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 px-4 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? "Procesando..." : "Iniciar Sesión"}
            </button>

            <div className="mt-6 space-y-2">
              <p className={`text-center text-sm ${isDarkMode ? "text-slate-400" : "text-gray-500"}`}>
                ¿No tiene una cuenta de gobierno?{" "}
                <Link
                  href="/registergobierno"
                  className={`${isDarkMode ? "text-green-400" : "text-green-600"} hover:underline font-medium`}
                >
                  Regístrese aquí
                </Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`py-4 px-6 border-t ${isDarkMode ? "bg-slate-800 border-slate-700 text-slate-400" : "bg-white text-gray-500"}`}
      >
        <div className="text-center text-sm">
          © {new Date().getFullYear()} Panel de Gobierno. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

