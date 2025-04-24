import type React from "react"
import { createContext, useContext } from "react"

export type ToastVariant = "default" | "success" | "destructive"

export interface Toast {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: ToastVariant
}

export type ToasterToast = Toast & {
  id: string
}

interface ToastContextType {
  toast: (props: Toast) => {
    id: string
    dismiss: () => void
    update: (props: ToasterToast) => void
  }
  dismiss: (id: string) => void
  toasts: ToasterToast[]
  showToast: (toast: Omit<Toast, "id">) => void
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
