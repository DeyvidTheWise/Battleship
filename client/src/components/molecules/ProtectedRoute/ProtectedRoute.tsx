import type React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import "./ProtectedRoute.css"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="protected-route-loading-spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  return <>{children}</>
}
