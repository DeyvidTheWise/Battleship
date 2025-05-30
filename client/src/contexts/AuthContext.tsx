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
    field?: string
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

  // Helper function to ensure role is of the correct type
  const ensureValidRole = (role: string): "user" | "admin" => {
    return role === "admin" ? "admin" : "user"
  }

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Make a real API call to the backend
      const response = await apiClient.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      })

      // Extract user data and token from the response
      const { token, user: userData } = response

      // Add stats if they don't exist in the API response and ensure role is valid
      const userWithStats: User = {
        ...userData,
        role: ensureValidRole(userData.role),
        stats: userData.stats || {
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
        },
      }

      // Store token and user data in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userWithStats))

      // Update state
      setUser(userWithStats)

      return { success: true, message: "Login successful" }
    } catch (error: any) {
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

  // Register function
  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true)

      // Make a real API call to the backend
      const response = await apiClient.post<AuthResponse>(
        "/api/auth/register",
        {
          username,
          email,
          password,
        }
      )

      // Extract user data and token from the response
      const { token, user: userData } = response

      // Add stats if they don't exist in the API response and ensure role is valid
      const userWithStats: User = {
        ...userData,
        role: ensureValidRole(userData.role),
        stats: userData.stats || {
          wins: 0,
          losses: 0,
          gamesPlayed: 0,
        },
      }

      // Store token and user data in localStorage
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(userWithStats))

      // Update state
      setUser(userWithStats)

      return { success: true, message: "Registration successful" }
    } catch (error: any) {
      // Handle API error responses with field-specific errors
      if (error.response?.data) {
        const errorData = error.response.data

        // Extract the error message and field from the server response
        const errorMessage =
          errorData.message ||
          errorData.error ||
          "An error occurred during registration"
        const field = errorData.field || undefined

        return {
          success: false,
          message: errorMessage,
          field: field,
        }
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during registration"
      return { success: false, message: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    // Use window.location for navigation instead of useNavigate
    window.location.href = "/"
  }

  // Update user function
  const updateUser = (updatedUser: User) => {
    localStorage.setItem("user", JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          // Try to get stored user data
          const storedUser = localStorage.getItem("user")

          if (storedUser) {
            try {
              // Parse stored user data
              const userData = JSON.parse(storedUser) as User
              setUser(userData)

              // Optionally verify token with the server
              try {
                const response = await apiClient.get<MeResponse>("/api/auth/me")
                // If the server returns updated user data, use that
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
                // If token verification fails, log the user out
                localStorage.removeItem("token")
                localStorage.removeItem("user")
                setUser(null)
              }
            } catch (e) {
              localStorage.removeItem("user")
            }
          } else {
            // If we have a token but no user data, try to get user data from the server
            try {
              const response = await apiClient.get<MeResponse>("/api/auth/me")
              if (response.user) {
                const userData: User = {
                  ...response.user,
                  role: ensureValidRole(response.user.role),
                  stats: response.user.stats || {
                    wins: 0,
                    losses: 0,
                    gamesPlayed: 0,
                  },
                }

                localStorage.setItem("user", JSON.stringify(userData))
                setUser(userData)
              }
            } catch (error) {
              localStorage.removeItem("token")
            }
          }
        }
      } catch (error) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Compute derived state
  const isAuthenticated = !!user
  const isAdmin = user?.role === "admin"

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isAdmin,
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
