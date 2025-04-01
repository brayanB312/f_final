"use client";
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation";
import { FileText, CheckCircle, XCircle, Users, Search, Plus } from "lucide-react"

// Layout components
import { Navbar } from "@/components/dahsboard-components/layout/navbar"
import { Sidebar } from "@/components/dahsboard-components/layout/sidebar"

// UI components
import { Modal } from "@/components/dahsboard-components/ui/modal"

// Import the modal components as named exports
import { FilterModalContent } from "@/components/dahsboard-components/modals/filter-modal"
import { DocumentModalContent } from "@/components/dahsboard-components/modals/document-modal"
import { FamilyModalContent } from "@/components/dahsboard-components/modals/family-modal"
import { ShareModalContent } from "@/components/dahsboard-components/modals/share-modal"
import { DownloadModalContent } from "@/components/dahsboard-components/modals/download-modal"
import { EditModalContent } from "@/components/dahsboard-components/modals/edit-modal"
import { DeleteModalContent } from "@/components/dahsboard-components/modals/delete-modal"

interface Documento {
  id: string;
  nombre: string;
  tipo: string;
  fechaCreacion: string;
  propietario: string;
  rutaArchivo?: string;  
  contenido?: string;    
}

interface ModalConfig {
  show: boolean
  type: string
  title: string
  item: Documento | null
}

interface PageConfig {
  title: string
  subtitle: string
  emptyMessage: string
  emptyIcon: React.ReactNode 
  addType: string
  addText: string
  searchPlaceholder: string
}

interface PageConfigs {
  [key: string]: PageConfig
}

export default function Dashboard() {
  
  const [user, setUser] = useState<{ id: string; nombre_completo: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userId = localStorage.getItem("userId");
      const userName = localStorage.getItem("userName");

      console.log("🔍 Intentando obtener User ID desde localStorage:", userId);
      if (!userId || !userName) {
        router.push("/login"); 
      } else {
        setUser({ id: userId, nombre_completo: userName });
        fetchDocuments(userId); // Fetch documents with userId
      }
    }
  }, []);

  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [documents, setDocuments] = useState<Documento[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Documento[]>([]);

  const fetchDocuments = async (userId: string | null) => {
    if (!userId) {
      console.error("❌ No se puede obtener documentos: userId es null");
      return;
    }
  
    setIsLoading(true);
    try {
      console.log("📡 Buscando documentos para el usuario:", userId);
      const response = await fetch(`/api/documents?userId=${userId}`);
      const data = await response.json();
  
      // Usar la ruta tal cual viene de la base de datos sin modificarla
      console.log("📄 Documentos obtenidos:", data);
      setDocuments(data);
      setFilteredDocuments(data);
    } catch (error) {
      console.error("⚠️ Error al obtener documentos:", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  // UI states with proper types
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
  const [activeItem, setActiveItem] = useState<string>("Dashboard")
  const [searchTerm, setSearchTerm] = useState<string>("")

  // Modal state with proper type
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    show: false,
    type: "",
    title: "",
    item: null,
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  
    const filtered = documents.filter(
      (doc) =>
        (doc.nombre && doc.nombre.toLowerCase().includes(term)) ||
        (doc.tipo && doc.tipo.toLowerCase().includes(term)) ||
        (doc.propietario && doc.propietario.toLowerCase().includes(term)),
    );
    setFilteredDocuments(filtered);
  };

  const handleAdd = (type: string) => {
    const titles: Record<string, string> = {
      documento: "Nuevo Documento",
      familiar: "Añadir Familiar",
      compartir: "Compartir Documento",
    }

    setModalConfig({
      show: true,
      type,
      title: titles[type] || "Añadir",
      item: null,
    })
  }

  const handleAction = (action: string, item: Documento) => {
    const titles: Record<string, string> = {
      view: "Ver Documento",
      download: "Descargar Documento",
      edit: "Editar Documento",
      delete: "Eliminar Documento",
    }

    setModalConfig({
      show: true,
      type: action,
      title: titles[action] || "Acción",
      item,
    })
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/delete/${id}`, {
        method: 'DELETE',
      });
  
      console.log('Response Status:', response.status);  // Imprime el código de estado para ver la respuesta
      
      if (response.ok) {
        // Filtrar el documento eliminado del estado
        setDocuments((prevDocs) => prevDocs.filter(doc => doc.id !== id));
        setFilteredDocuments((prevDocs) => prevDocs.filter(doc => doc.id !== id));
        closeModal(); // Cerrar el modal después de eliminar
        alert('Documento eliminado exitosamente');
      } else {
        throw new Error('Error al eliminar el documento');
      }
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      alert('Hubo un problema al eliminar el documento');
    }
  };

  const handleLogout = () => {
    alert("Cerrando sesión...")
  }

  const closeModal = () => {
    setModalConfig({ show: false, type: "", title: "", item: null })
  }

  // Render modal content based on type
  const renderModalContent = () => {
    const { type, item } = modalConfig;

    switch (type) {
      case "filter":
        return <FilterModalContent />
      case "documento":
        return <DocumentModalContent />
      case "familiar":
        return <FamilyModalContent />
      case "compartir":
        return <ShareModalContent />
      case "download":
        return item ? <DownloadModalContent documento={item} onClose={closeModal} /> : null;
      case "edit":
        return <EditModalContent />
      case "delete":
        return <DeleteModalContent   onDelete={() => handleDelete(item?.id || '')} onClose={closeModal}/>
      default:
        return null
    }
  }

  // Page configuration with proper type
  const pageConfig: PageConfigs = {
    Dashboard: {
      title: `Bienvenido, ${user?.nombre_completo}`,
      subtitle: "Gestiona y visualiza todos tus documentos y archivos familiares",
      emptyMessage: "No hay documentos disponibles. Agrega documentos para verlos aquí.",
      emptyIcon: <FileText className="h-8 w-8 text-gray-400" />,
      addType: "documento",
      addText: "Nuevo Documento",
      searchPlaceholder: "Buscar documentos...",
    },
    "Mis Documentos": {
      title: "Mis Documentos",
      subtitle: "Gestiona tus documentos personales",
      emptyMessage: "No tienes documentos personales. Sube documentos para verlos aquí.",
      emptyIcon: <FileText className="h-8 w-8 text-gray-400" />,
      addType: "documento",
      addText: "Subir Documento",
      searchPlaceholder: "Buscar documentos...",
    },
    Familiares: {
      title: "Familiares",
      subtitle: "Gestiona los miembros de tu familia y sus documentos",
      emptyMessage: "No tienes familiares registrados. Añade familiares para verlos aquí.",
      emptyIcon: <Users className="h-8 w-8 text-gray-400" />,
      addType: "familiar",
      addText: "Añadir Familiar",
      searchPlaceholder: "Buscar familiares...",
    },
    "Compartir Documentos": {
      title: "Compartir Documentos",
      subtitle: "Gestiona los documentos que has compartido con tus familiares",
      emptyMessage: "No has compartido documentos. Comparte documentos para verlos aquí.",
      emptyIcon: <FileText className="h-8 w-8 text-gray-400" />,
      addType: "compartir",
      addText: "Compartir Documento",
      searchPlaceholder: "Buscar documentos compartidos...",
    },
  }

  // Render content based on active menu item
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      )
    }

    // Use type guard to ensure activeItem exists in pageConfig
    const config = pageConfig[activeItem as keyof typeof pageConfig] || pageConfig.Dashboard

    return (
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{config.title}</h1>
              {config.subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{config.subtitle}</p>}
            </div>
          </div>
        </div>

        {/* Dashboard stats */}
        {activeItem === "Dashboard" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Documentos</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-500 text-white mr-4">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Documentos Validados</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-500 text-white mr-4">
                  <XCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Pendientes de Validación</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-500 text-white mr-4">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Miembros Familiares</p>
                  <p className="text-2xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                placeholder={config.searchPlaceholder || "Buscar..."}
                onChange={handleSearch}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={() => handleAdd(config.addType)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                {config.addText || "Añadir"}
              </button>
            </div>
          </div>
        </div>

        {/* Content area */}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {filteredDocuments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-gray-100 p-4 rounded-full mb-4">{config.emptyIcon}</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay datos disponibles</h3>
              <p className="text-sm text-gray-500 max-w-md mb-4">{config.emptyMessage}</p>
              <button
                onClick={() => handleAdd(config.addType)}
                className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2 inline-block" />
                {config.addText}
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Propietario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {doc.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {doc.tipo}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.propietario}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAction('download', doc)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Descargar
                          </button>
                          <button
                            onClick={() => handleAction('delete', doc)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar userData={user?.nombre_completo} onLogout={handleLogout} />

      <div className="flex flex-1 pt-16">
        {/* Sidebar */}
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        {/* Main content */}
        <div className="flex-1 overflow-hidden">
          {/* Content area */}
          <main className="h-full overflow-y-auto p-3 sm:p-6 bg-gray-50">{renderContent()}</main>
        </div>
      </div>

      {/* Modals */}
      {modalConfig.show && (
        <Modal title={modalConfig.title} onClose={closeModal}>
          {renderModalContent()}
        </Modal>
      )}
    </div>
  )
}

