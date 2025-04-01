"use client"
import { LayoutDashboard, FileText, Users, Share2, Menu, X } from "lucide-react"
import { ReactNode } from "react"

// Definición de tipos para las props
interface SidebarProps {
  activeItem: string
  setActiveItem: (item: string) => void
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

// Definición de tipo para los items del menú
interface MenuItem {
  name: string
  icon: ReactNode
}

// Menu items definition
const menuItems: MenuItem[] = [
  { name: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: "Mis Documentos", icon: <FileText className="w-5 h-5" /> },
  { name: "Familiares", icon: <Users className="w-5 h-5" /> },
  { name: "Compartir Documentos", icon: <Share2 className="w-5 h-5" /> },
]

export function Sidebar({ 
  activeItem, 
  setActiveItem, 
  isSidebarOpen, 
  setIsSidebarOpen 
}: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar - floating button */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed z-40 bottom-4 right-4 p-3 rounded-full bg-primary text-white shadow-lg"
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Overlay to close sidebar on mobile - Modificado para evitar el fondo negro */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-20 lg:hidden transition-opacity duration-300" 
          onClick={() => setIsSidebarOpen(false)}
          style={{ animation: 'fadeIn 0.3s ease-in-out' }}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-[80%] sm:w-64 transition-all duration-300 ease-in-out transform 
                  ${isSidebarOpen ? "translate-x-0 shadow-xl" : "-translate-x-full"} 
                  lg:translate-x-0 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] top-16`}
        aria-label="Menú principal"
      >
        <div className="flex flex-col h-full">
          {/* Navigation menu */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  setActiveItem(item.name)
                  if (window.innerWidth < 1024) {
                    setIsSidebarOpen(false)
                  }
                }}
                className={`flex items-center w-full px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm rounded-lg transition-colors ${
                  activeItem === item.name
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                aria-current={activeItem === item.name ? "page" : undefined}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Estilos CSS para la animación */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}