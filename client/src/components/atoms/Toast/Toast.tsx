"use client"

import * as React from "react"
import "./Toast.css"


export type ToastVariant = "default" | "destructive" | "success" | "warning"


export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div className="toast-provider">{children}</div>
}

export const ToastViewport: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  return <div className="toast-viewport" {...props} />
}

export const Toast: React.FC<{
  children: React.ReactNode
  variant?: ToastVariant
  onOpenChange?: (open: boolean) => void
}> = ({ children, variant = "default", onOpenChange }) => {
  React.useEffect(() => {
    onOpenChange?.(true)
    return () => onOpenChange?.(false)
  }, [onOpenChange])

  return <div className={`toast toast-${variant}`}>{children}</div>
}

export const ToastTitle: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="toast-title" {...props}>
      {children}
    </div>
  )
}

export const ToastDescription: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
  return (
    <div className="toast-description" {...props}>
      {children}
    </div>
  )
}

export const ToastClose: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  return (
    <button className="toast-close" {...props}>
      ×
    </button>
  )
}

export const ToastAction: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button className="toast-action" {...props}>
      {children}
    </button>
  )
}

export type ToastProps = React.ComponentProps<typeof Toast>
export type ToastActionElement = React.ReactElement<typeof ToastAction>
