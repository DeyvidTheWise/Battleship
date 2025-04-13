import React, { useState } from "react"
import { Text } from "../atoms/Text"
import Button from "../atoms/Button"
import { useAuth } from "../../context/AuthContext" // Import useAuth

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
  onLoginSuccess: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { login } = useAuth() // Get login function from AuthContext
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [authError, setAuthError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Login failed")
      }
      const { token, user } = await response.json()
      login(token, user) // Use AuthContext login function
      setAuthError(null)
      onClose()
      onLoginSuccess()
    } catch (err) {
      console.error("Login error:", err)
      setAuthError((err as Error).message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Text variant="h2" style={{ marginBottom: "1rem" }}>
          Login
        </Text>
        {authError && (
          <Text style={{ color: "#ff4444", marginBottom: "0.5rem" }}>
            {authError}
          </Text>
        )}
        <form onSubmit={handleLogin}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button type="submit">Submit</Button>
              <Button onClick={onClose} variant="danger">
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginModal
