"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../../components/atoms/Button/Button"
import { Input } from "../../components/atoms/Input/Input"
import { useToast } from "../../contexts/ToastContext"
import { Ship, Loader2, AlertCircle, Check, X } from "lucide-react"
import { apiClient } from "../../utils/ApiClient"
import "./AuthPages.css"

interface RegisterResponse {
  token: string
  user: {
    id: number
    username: string
    email: string
    role: string
  }
}

interface ErrorResponse {
  message: string
  field?: "username" | "email" | "password" | "confirmPassword" | "general"
}

interface UsernameCheckResponse {
  available: boolean
  message: string
}

const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null = null

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }

    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor)
    })
  }
}

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{
    username?: string
    email?: string
    password?: string
    confirmPassword?: string
    general?: string
  }>({})
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  )
  const { register } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const checkUsernameAvailability = useCallback(
    debounce(async (username: string) => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null)
        return
      }

      setIsCheckingUsername(true)
      try {
        const response = await apiClient.get<UsernameCheckResponse>(
          `/api/auth/check-username?username=${encodeURIComponent(username)}`
        )

        setUsernameAvailable(response.available)

        if (!response.available) {
          setErrors((prev) => ({
            ...prev,
            username: "Username is already taken",
          }))
        } else {
          setErrors((prev) => {
            if (prev.username === "Username is already taken") {
              return { ...prev, username: undefined }
            }
            return prev
          })
        }
      } catch (error) {
        console.error("Error checking username:", error)
        setUsernameAvailable(null)
      } finally {
        setIsCheckingUsername(false)
      }
    }, 500),
    []
  )

  useEffect(() => {
    if (username === "") {
      if (errors.username)
        setErrors((prev) => ({ ...prev, username: undefined }))
      setUsernameAvailable(null)
      return
    }

    if (username.length > 20) {
      setErrors((prev) => ({
        ...prev,
        username: "Username must be less than 20 characters",
      }))
      setUsernameAvailable(null)
    } else if (username.length >= 3) {
      if (errors.username && errors.username.includes("characters")) {
        setErrors((prev) => ({ ...prev, username: undefined }))
      }

      checkUsernameAvailability(username)
    } else {
      setUsernameAvailable(null)
    }
  }, [username, errors.username, checkUsernameAvailability])

  useEffect(() => {
    if (email === "") {
      if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setErrors((prev) => ({
        ...prev,
        email: "Please enter a valid email address",
      }))
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }))
    }
  }, [email, errors.email])

  useEffect(() => {
    if (password === "") {
      if (errors.password)
        setErrors((prev) => ({ ...prev, password: undefined }))
      return
    }

    if (password.length < 6) {
      setErrors((prev) => ({
        ...prev,
        password: "Password must be at least 6 characters",
      }))
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }))
    }
  }, [password, errors.password])

  useEffect(() => {
    if (confirmPassword === "") {
      if (errors.confirmPassword)
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
      return
    }

    if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }))
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }))
    }
  }, [confirmPassword, password, errors.confirmPassword])

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {}
    let isValid = true

    if (!username.trim()) {
      newErrors.username = "Username is required"
      isValid = false
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters"
      isValid = false
    } else if (username.length > 20) {
      newErrors.username = "Username must be less than 20 characters"
      isValid = false
    } else if (usernameAvailable === false) {
      newErrors.username = "Username is already taken"
      isValid = false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email.trim()) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address"
      isValid = false
    }

    if (!password) {
      newErrors.password = "Password is required"
      isValid = false
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      isValid = false
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setErrors({})

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await apiClient.post<RegisterResponse>(
        "/api/auth/register",
        {
          username,
          email,
          password,
        }
      )

      if (response && response.token && response.user) {
        localStorage.setItem("token", response.token)

        await register(username, email, password)
        showToast({
          title: "Registration successful",
          description: "Welcome to Battleship Online!",
          variant: "success",
        })
        navigate("/")
      } else {
        throw new Error("Invalid response from server")
      }
    } catch (error) {
      console.error("Registration error:", error)

      if (error && typeof error === "object" && "response" in error) {
        const errorResponse = (error as any).response
        const errorData = errorResponse?.data as ErrorResponse | undefined

        if (errorData) {
          console.log("Server error response:", errorData)

          if (errorData.field) {
            const fieldName = errorData.field as keyof typeof errors
            setErrors((prev) => ({
              ...prev,
              [fieldName]: errorData.message,
            }))

            showToast({
              title: "Registration failed",
              description: `${
                fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
              }: ${errorData.message}`,
              variant: "destructive",
            })
          } else {
            setErrors((prev) => ({
              ...prev,
              general: errorData.message,
            }))

            showToast({
              title: "Registration failed",
              description: errorData.message,
              variant: "destructive",
            })
          }
          return
        }
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : "Registration failed. Please try again."
      setErrors((prev) => ({
        ...prev,
        general: errorMessage,
      }))

      showToast({
        title: "Registration failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1A2A44] text-[#F5F7FA]">
      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-md">
          <div className="mb-6 text-center">
            <Ship className="mx-auto mb-2 h-12 w-12 text-[#4ECDC4]" />
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="mt-2 text-[#A3BFFA]">
              Join Battleship Online and start playing
            </p>
          </div>

          <div className="rounded-lg bg-[#2D3748] p-6 shadow-lg">
            {errors.general && (
              <div className="mb-4 p-3 bg-[#FF6B6B]/20 border border-[#FF6B6B] rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-[#FF6B6B] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="mb-1 block text-sm font-medium"
                >
                  Username
                </label>
                <div className="relative">
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={() => {
                      if (username && username.length < 3) {
                        setErrors((prev) => ({
                          ...prev,
                          username: "Username must be at least 3 characters",
                        }))
                      }
                    }}
                    required
                    className={`bg-[#1A2A44] border-[#4A4A4A] text-[#F5F7FA] placeholder:text-[#A3BFFA] pr-10 ${
                      errors.username
                        ? "border-[#FF6B6B]"
                        : usernameAvailable === true
                        ? "border-green-500"
                        : ""
                    }`}
                    placeholder="Choose a username"
                  />
                  {isCheckingUsername && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Loader2 className="h-4 w-4 animate-spin text-[#A3BFFA]" />
                    </div>
                  )}
                  {!isCheckingUsername && usernameAvailable === true && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <Check className="h-4 w-4 text-green-500" />
                    </div>
                  )}
                  {!isCheckingUsername && usernameAvailable === false && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <X className="h-4 w-4 text-[#FF6B6B]" />
                    </div>
                  )}
                </div>
                {errors.username && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">
                    {errors.username}
                  </p>
                )}
                {!errors.username &&
                  usernameAvailable === true &&
                  username.length >= 3 && (
                    <p className="mt-1 text-xs text-green-500">
                      Username is available
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block text-sm font-medium"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`bg-[#1A2A44] border-[#4A4A4A] text-[#F5F7FA] placeholder:text-[#A3BFFA] ${
                    errors.email ? "border-[#FF6B6B]" : ""
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1 block text-sm font-medium"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className={`bg-[#1A2A44] border-[#4A4A4A] text-[#F5F7FA] placeholder:text-[#A3BFFA] ${
                    errors.password ? "border-[#FF6B6B]" : ""
                  }`}
                  placeholder="Create a password"
                />
                {errors.password && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1 block text-sm font-medium"
                >
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className={`bg-[#1A2A44] border-[#4A4A4A] text-[#F5F7FA] placeholder:text-[#A3BFFA] ${
                    errors.confirmPassword ? "border-[#FF6B6B]" : ""
                  }`}
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-[#FF6B6B]">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                disabled={
                  isLoading || isCheckingUsername || usernameAvailable === false
                }
                className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-[#F5F7FA]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Register"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-[#A3BFFA]">
                Already have an account?{" "}
                <Link
                  to="/auth/login"
                  className="text-[#4ECDC4] hover:underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
