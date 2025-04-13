import React, { createContext, useContext, useState, useEffect } from "react"

interface AuthContextType {
  user: {
    id: string
    firstname: string
    lastname: string
    email: string
    xp: number
  } | null
  token: string | null
  login: (token: string, user: any) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)

  // Load initial state from localStorage and listen for changes
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }

    // Listen for storage events to handle cross-tab updates
    const handleStorageChange = () => {
      const newToken = localStorage.getItem("token")
      const newUser = localStorage.getItem("user")
      if (newToken && newUser) {
        setToken(newToken)
        setUser(JSON.parse(newUser))
      } else {
        setToken(null)
        setUser(null)
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const login = (newToken: string, newUser: any) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    setToken(newToken)
    setUser(newUser)
    // Trigger a storage event to notify other tabs
    window.dispatchEvent(new Event("storage"))
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setToken(null)
    setUser(null)
    // Trigger a storage event to notify other tabs
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
