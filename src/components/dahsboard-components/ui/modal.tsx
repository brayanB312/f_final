"use client"

import { ReactNode, useEffect, useRef } from "react"
import { X } from "lucide-react"

interface ModalProps {
  title: string
  children: ReactNode
  onClose: () => void
  className?: string
  overlayClassName?: string
  hideFooter?: boolean // Better name than hasOwnButtons
}

export function Modal({
  title,
  children,
  onClose,
  className = "",
  overlayClassName = "",
  hideFooter = false
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: globalThis.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    // Use global event types
    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleEscape)
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm ${overlayClassName}`} 
        onClick={onClose} 
      />
      
      <div 
        ref={modalRef}
        className={`relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto ${className}`}
      >
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button 
            onClick={onClose} 
            className="rounded-full p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          {children}
        </div>
        
        {!hideFooter && (
          <div className="sticky bottom-0 bg-white p-4 border-t flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}