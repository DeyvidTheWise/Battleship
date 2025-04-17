import React, { useState } from "react"
import { Text, Button } from "../atoms"
import { useAuth } from "../../context/AuthContext" // Import useAuth

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
  onRegisterSuccess: () => void
}

const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const { login } = useAuth() // Get login function from AuthContext
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })
  const [authError, setAuthError] = useState<string | null>(null)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Registration failed")
      }
      const { userId } = await response.json()

      // Automatically log in the user after registration
      const loginResponse = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerData.email,
          password: registerData.password,
        }),
      })
      if (!loginResponse.ok) {
        const errorData = await loginResponse.json()
        throw new Error(errorData.error || "Login after registration failed")
      }
      const { token, user } = await loginResponse.json()
      login(token, user) // Use AuthContext login function
      setAuthError(null)
      onClose()
      onRegisterSuccess()
    } catch (err) {
      console.error("Register error:", err)
      setAuthError((err as Error).message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <Text variant="h2" style={{ marginBottom: "1rem" }}>
          Register
        </Text>
        {authError && (
          <Text style={{ color: "#ff4444", marginBottom: "0.5rem" }}>
            {authError}
          </Text>
        )}
        <form onSubmit={handleRegister}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <input
              type="text"
              placeholder="First Name"
              value={registerData.firstname}
              onChange={(e) =>
                setRegisterData({ ...registerData, firstname: e.target.value })
              }
            />
            <input
              type="text"
              placeholder="Last Name"
              value={registerData.lastname}
              onChange={(e) =>
                setRegisterData({ ...registerData, lastname: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
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

export default RegisterModal
