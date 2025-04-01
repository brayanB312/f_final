"use client"

import type React from "react"

import { useState } from "react"
import {
  Search,
  FileText,
  Check,
  X,
  ChevronLeft,
  Settings,
  User,
  LogOut,
  Moon,
  Sun,
  Home,
  Shield,
  Clock,
  Download,
  Eye,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Tipos de estado para los documentos
const STATUS = {
  PENDING: "Pendiente",
  APPROVED: "Aprobado",
  REJECTED: "Rechazado",
}

// Definir un tipo para los estados
type StatusType = (typeof STATUS)[keyof typeof STATUS] | "Parcial"

// Definir interfaces para los tipos de datos
interface PdfFile {
  id: number
  name: string
  description: string
  date: string
  status: StatusType
  url?: string
}

interface UserData {
  name: string
  id: string
  initials: string
  department: string
  documentType: string
  avatar?: string
}

interface Document {
  id: number
  key: string
  user: UserData
  type: string
  status: StatusType
  date: string
  time: string
  pdfs: PdfFile[]
}

// Función para obtener el color de estado
const getStatusColor = (status: StatusType) => {
  switch (status) {
    case STATUS.APPROVED:
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
    case STATUS.REJECTED:
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
    case "Parcial":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
  }
}

// Función para obtener el icono de estado
const getStatusIcon = (status: StatusType) => {
  switch (status) {
    case STATUS.APPROVED:
      return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
    case STATUS.REJECTED:
      return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
    case "Parcial":
      return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    default:
      return <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
  }
}

interface PanelGobiernoProps {
  adminUser?: {
    name: string
    role: string
    avatar?: string
    initials?: string
  }
}

export default function PanelGobierno({ adminUser = { name: "Admin", role: "Administrador" } }: PanelGobiernoProps) {
  // Estados para la UI
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState("documento")
  const [showPdfDialog, setShowPdfDialog] = useState(false)
  const [selectedPdfIndex, setSelectedPdfIndex] = useState(0)
  const [searchKey, setSearchKey] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estados para los datos
  const [document, setDocument] = useState<Document | null>(null)

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

  // Función para buscar documento
  const searchDocument = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchKey) return

    setIsLoading(true)
    try {
      // Aquí iría la llamada a la API para buscar el documento
      // const response = await fetch(`/api/documents/${searchKey}`)
      // const data = await response.json()
      // setDocument(data)

      // Simulación de carga (eliminar en producción)
      setTimeout(() => {
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error al buscar documento:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Función para validar un PDF
  const validatePdf = async (pdfId: number) => {
    try {
      // Aquí iría la llamada a la API para validar el PDF
      // await fetch(`/api/pdfs/${pdfId}/validate`, { method: 'POST' })

      // Actualizar el estado local (esto se reemplazaría con una nueva consulta)
      if (document) {
        const updatedPdfs = document.pdfs.map((pdf) => (pdf.id === pdfId ? { ...pdf, status: STATUS.APPROVED } : pdf))
        setDocument({ ...document, pdfs: updatedPdfs })
      }
    } catch (error) {
      console.error("Error al validar PDF:", error)
    }
  }

  // Función para denegar un PDF
  const rejectPdf = async (pdfId: number) => {
    try {
      // Aquí iría la llamada a la API para denegar el PDF
      // await fetch(`/api/pdfs/${pdfId}/reject`, { method: 'POST' })

      // Actualizar el estado local (esto se reemplazaría con una nueva consulta)
      if (document) {
        const updatedPdfs = document.pdfs.map((pdf) => (pdf.id === pdfId ? { ...pdf, status: STATUS.REJECTED } : pdf))
        setDocument({ ...document, pdfs: updatedPdfs })
      }
    } catch (error) {
      console.error("Error al denegar PDF:", error)
    }
  }

  // Función para validar todos los PDFs
  const validateAllPdfs = async () => {
    try {
      // Aquí iría la llamada a la API para validar todos los PDFs
      // await fetch(`/api/documents/${document?.id}/validate-all`, { method: 'POST' })

      // Actualizar el estado local (esto se reemplazaría con una nueva consulta)
      if (document) {
        const updatedPdfs = document.pdfs.map((pdf) => ({ ...pdf, status: STATUS.APPROVED }))
        setDocument({ ...document, pdfs: updatedPdfs, status: STATUS.APPROVED })
      }
    } catch (error) {
      console.error("Error al validar todos los PDFs:", error)
    }
  }

  // Función para denegar todos los PDFs
  const rejectAllPdfs = async () => {
    try {
      // Aquí iría la llamada a la API para denegar todos los PDFs
      // await fetch(`/api/documents/${document?.id}/reject-all`, { method: 'POST' })

      // Actualizar el estado local (esto se reemplazaría con una nueva consulta)
      if (document) {
        const updatedPdfs = document.pdfs.map((pdf) => ({ ...pdf, status: STATUS.REJECTED }))
        setDocument({ ...document, pdfs: updatedPdfs, status: STATUS.REJECTED })
      }
    } catch (error) {
      console.error("Error al denegar todos los PDFs:", error)
    }
  }

  // Función para enviar decisiones
  const sendDecisions = async () => {
    try {
      // Aquí iría la llamada a la API para enviar las decisiones
      // await fetch(`/api/documents/${document?.id}/send-decisions`, { method: 'POST' })

      // Mostrar mensaje de éxito o redirigir
      alert("Decisiones enviadas correctamente")
    } catch (error) {
      console.error("Error al enviar decisiones:", error)
    }
  }

  // Obtener el PDF actual
  const currentPdf = document?.pdfs[selectedPdfIndex] || null

  // Función para cambiar al PDF anterior
  const prevPdf = () => {
    if (!document) return
    setSelectedPdfIndex((prev) => (prev > 0 ? prev - 1 : document.pdfs.length - 1))
  }

  // Función para cambiar al PDF siguiente
  const nextPdf = () => {
    if (!document) return
    setSelectedPdfIndex((prev) => (prev < document.pdfs.length - 1 ? prev + 1 : 0))
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header with enhanced navbar */}
      <header className="sticky top-0 z-10 border-b bg-white dark:bg-slate-800 dark:border-slate-700">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden">
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">Volver</span>
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Panel de Gobierno</h1>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                    <Home className="h-4 w-4 mr-1" />
                    Inicio
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Página principal</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>

          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    <span className="sr-only">Cambiar tema</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Profile Dropdown - Enhanced */}
            <Separator orientation="vertical" className="h-8 mx-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={adminUser.avatar || "/placeholder.svg"} alt={adminUser.name} />
                    <AvatarFallback>{adminUser.initials || adminUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start text-sm">
                    <span className="font-medium">{adminUser.name}</span>
                    <span className="text-xs text-muted-foreground">{adminUser.role}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configuración</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="container mx-auto p-4 md:p-6 flex flex-col items-center justify-center">
        <div className="w-full max-w-3xl grid gap-6">
          {/* Search Section */}
          <section className="space-y-4">
            <div className="flex flex-col gap-2 text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground dark:text-white">
                Buscar Documento por Clave
              </h2>
              <p className="text-muted-foreground">Ingrese la clave única del documento para realizar la búsqueda</p>
            </div>
            <form className="flex w-full items-center space-x-2" onSubmit={searchDocument}>
              <Input
                type="text"
                placeholder="Ingrese clave del documento"
                className="flex-1 text-foreground dark:text-white dark:bg-slate-800 dark:border-slate-700 dark:placeholder:text-slate-400"
                value={searchKey}
                onChange={(e) => setSearchKey(e.target.value)}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando
                  </span>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Buscar
                  </>
                )}
              </Button>
            </form>
          </section>

          {/* Results Section */}
          {document && (
            <section className="space-y-4">
              <h3 className="text-xl font-semibold text-center text-foreground dark:text-white">
                Resultados de búsqueda
              </h3>

              <Tabs defaultValue="documento" value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="documento">Documento</TabsTrigger>
                  <TabsTrigger value="pdf">PDF</TabsTrigger>
                </TabsList>

                <TabsContent value="documento">
                  <Card className="dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-foreground dark:text-white">
                          Documento Clave: {document.key}
                        </CardTitle>
                        <Badge className={getStatusColor(document.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(document.status)}
                            {document.status}
                          </span>
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          <span>{document.type}</span>
                        </div>
                        <div className="text-muted-foreground">Fecha: {document.date}</div>
                      </div>

                      {/* PDF Files List */}
                      <div className="mt-4 border rounded-md p-3 dark:border-slate-700">
                        <h4 className="text-sm font-medium mb-2 text-foreground dark:text-slate-200">
                          Archivos adjuntos:
                        </h4>
                        <div className="space-y-2">
                          {document.pdfs.map((pdf, index) => (
                            <div
                              key={pdf.id}
                              className={`flex flex-col p-3 rounded-md border dark:border-slate-700 ${
                                index === selectedPdfIndex
                                  ? "bg-primary/5 border-primary/30 dark:bg-primary/10"
                                  : "hover:bg-muted/50 dark:hover:bg-slate-700/50"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <FileText className={`h-4 w-4 ${index === selectedPdfIndex ? "text-primary" : ""}`} />
                                  <div>
                                    <p className="text-sm font-medium text-foreground dark:text-white">{pdf.name}</p>
                                    <p className="text-xs text-muted-foreground">{pdf.description}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge className={getStatusColor(pdf.status)}>
                                    <span className="flex items-center gap-1">
                                      {getStatusIcon(pdf.status)}
                                      {pdf.status}
                                    </span>
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={() => {
                                      setSelectedPdfIndex(index)
                                      setActiveTab("pdf")
                                    }}
                                  >
                                    <Eye className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>

                              {/* Botones de validación por documento */}
                              <div className="flex justify-end mt-2 gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950 dark:border-green-800"
                                  onClick={() => validatePdf(pdf.id)}
                                  disabled={pdf.status === STATUS.APPROVED}
                                >
                                  <Check className="mr-1 h-3 w-3" />
                                  Validar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800"
                                  onClick={() => rejectPdf(pdf.id)}
                                  disabled={pdf.status === STATUS.REJECTED}
                                >
                                  <X className="mr-1 h-3 w-3" />
                                  Denegar
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 border rounded-md p-3 bg-slate-50 dark:bg-slate-800 dark:border-slate-700">
                        <h4 className="text-sm font-medium mb-2 text-foreground dark:text-slate-200">
                          Datos del usuario que solicitó la validación:
                        </h4>
                        <div className="flex items-start gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                              {document.user.initials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="space-y-1">
                            <div className="font-medium text-foreground dark:text-white">{document.user.name}</div>
                            <div className="text-sm text-muted-foreground">ID: {document.user.id}</div>
                            <div className="text-sm text-foreground dark:text-slate-300">
                              Departamento: {document.user.department}
                            </div>
                            <div className="text-sm text-foreground dark:text-slate-300">
                              Tipo de documento: {document.user.documentType}
                            </div>
                            <div className="text-sm text-muted-foreground">Fecha de solicitud: {document.date}</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col pt-2 gap-3">
                      <div className="flex justify-between w-full">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={sendDecisions}
                        >
                          <Shield className="mr-1 h-4 w-4" />
                          Enviar decisiones
                        </Button>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950 dark:border-green-800"
                            onClick={() => validateAllPdfs()}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Validar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800"
                            onClick={() => rejectAllPdfs()}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Denegar
                          </Button>
                        </div>
                      </div>

                      {/* Botones para validar o denegar todos los documentos */}
                      <div className="w-full border-t pt-3 dark:border-slate-700">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground dark:text-white">
                            Validación masiva:
                          </span>
                          <div className="flex gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={validateAllPdfs}
                            >
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Validar todos
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="bg-red-600 hover:bg-red-700 text-white"
                              onClick={rejectAllPdfs}
                            >
                              <XCircle className="mr-1 h-4 w-4" />
                              Denegar todos
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardFooter>
                  </Card>
                </TabsContent>

                <TabsContent value="pdf">
                  {currentPdf && (
                    <Card className="dark:bg-slate-800 dark:border-slate-700">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-lg flex items-center text-foreground dark:text-white">
                              {currentPdf.name}
                              <Badge variant="outline" className="ml-2 dark:border-slate-600">
                                {selectedPdfIndex + 1} de {document.pdfs.length}
                              </Badge>
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-sm text-muted-foreground">{currentPdf.description}</p>
                              <Badge className={getStatusColor(currentPdf.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(currentPdf.status)}
                                  {currentPdf.status}
                                </span>
                              </Badge>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPdfDialog(true)}
                            className="dark:border-slate-600 dark:text-slate-200"
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Vista completa
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md border overflow-hidden bg-white dark:border-slate-700">
                          <div className="aspect-[16/9] w-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                            {/* PDF Preview */}
                            <iframe
                              src={
                                currentPdf.url ||
                                `/placeholder.svg?height=400&width=600&text=${encodeURIComponent(currentPdf.name)}`
                              }
                              className="w-full h-[400px]"
                              title="Vista previa del PDF"
                            />
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setActiveTab("documento")}
                            className="dark:border-slate-600 dark:text-slate-200"
                          >
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Volver
                          </Button>

                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 dark:border-slate-600"
                              onClick={prevPdf}
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 dark:border-slate-600"
                              onClick={nextPdf}
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-950 dark:border-green-800"
                            onClick={() => validatePdf(currentPdf.id)}
                            disabled={currentPdf.status === STATUS.APPROVED}
                          >
                            <Check className="mr-1 h-4 w-4" />
                            Validar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950 dark:border-red-800"
                            onClick={() => rejectPdf(currentPdf.id)}
                            disabled={currentPdf.status === STATUS.REJECTED}
                          >
                            <X className="mr-1 h-4 w-4" />
                            Denegar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="dark:border-slate-600 dark:text-slate-200"
                            className="dark:border-slate-600 dark:text-slate-200"
                            onClick={() => window.open(currentPdf.url, "_blank")}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            Descargar
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </section>
          )}
        </div>
      </main>

      {/* PDF Viewer Dialog */}
      {currentPdf && (
        <Dialog open={showPdfDialog} onOpenChange={setShowPdfDialog}>
          <DialogContent className="max-w-4xl h-[80vh] dark:bg-slate-800 dark:border-slate-700">
            <DialogHeader>
              <DialogTitle className="dark:text-white">{currentPdf.name}</DialogTitle>
              <DialogDescription>
                <div className="flex justify-between">
                  <span className="dark:text-slate-300">Documento: {document?.key}</span>
                  {currentPdf.description && <span className="text-muted-foreground">{currentPdf.description}</span>}
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden rounded-md border dark:border-slate-700">
              <iframe
                src={
                  currentPdf.url || `/placeholder.svg?height=600&width=800&text=${encodeURIComponent(currentPdf.name)}`
                }
                className="w-full h-[calc(80vh-120px)]"
                title="Vista completa del PDF"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

