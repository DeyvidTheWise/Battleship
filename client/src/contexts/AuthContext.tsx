"use client"

import type React from "react"
import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  useContext,
} from "react"
import apiClient from "../utils/ApiClient"

export interface User {
  id: string
  username: string
  email: string
  avatar?: string
  role: "user" | "admin"
  bio?: string
  stats: {
    wins: number
    losses: number
    gamesPlayed: number
  }
}

interface AuthResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    role: string
    avatar?: string
    bio?: string
    stats?: {
      wins: number
      losses: number
      gamesPlayed: number
    }
  }
}

interface MeResponse {
  user: {
    id: string
    username: string
    email: string
    role: string
    avatar?: string
    bio?: string
    stats?: {
      wins: number
      losses: number
      gamesPlayed: number
    }
  }
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (
    email: string,
    password: string
  ) => Promise<{
    success: boolean
    message: string
  }>
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<{
    success: boolean
    message: string
  }>
  logout: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const ensureValidRole = (role: string): "user" | "admin" => {
    return role === "admin" ? "admin" : "user"
  }

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const response = await apiClient.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      })

      const { token, user: userData } = response

      const userWithStats: User = {
        ...userData,
        role: ensureValidRole(userData.role),
        stats: userData.stats || {
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
        },
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userWithStats))

      setUser(userWithStats)

      return { success: true, message: "Login successful" }
    } catch (error: any) {
      console.error("Login error:", error)
      const errorMessage =
        error.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An error occurred during login")

      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true)

      const response = await apiClient.post<AuthResponse>(
        "/api/auth/register",
        {
          username,
          email,
          password,
        }
      )

      const { token, user: userData } = response

      const userWithStats: User = {
        ...userData,
        role: ensureValidRole(userData.role),
        stats: userData.stats || {
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
        },
      }

      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userWithStats))

      setUser(userWithStats)

      return { success: true, message: "Registration successful" }
    } catch (error: any) {
      console.error("Registration error:", error)
      const errorMessage =
        error.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "An error occurred during registration")

      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/"
  }

  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const storedUser = localStorage.getItem("user")

          if (storedUser) {
            try {
              const userData = JSON.parse(storedUser) as User
              setUser(userData)

              try {
                const response = await apiClient.get<MeResponse>("/api/auth/me")
                if (response.user) {
                  const updatedUser: User = {
                    ...response.user,
                    role: ensureValidRole(response.user.role),
                    stats: response.user.stats ||
                      userData.stats || {
                        wins: 0,
                        losses: 0,
                        gamesPlayed: 0,
                      },
                  }

                  localStorage.setItem("user", JSON.stringify(updatedUser))
                  setUser(updatedUser)
                }
              } catch (verifyError) {
                console.error("Token verification error:", verifyError)
              }
            } catch (parseError) {
              console.error("Error parsing stored user:", parseError)
              localStorage.removeItem("user")
            }
          }
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
    isLoading,
    login,
    register,
    logout,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
