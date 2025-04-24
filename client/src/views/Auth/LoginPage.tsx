"use client"

import type React from "react"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../../components/atoms/Button/Button"
import { Input } from "../../components/atoms/Input/Input"
import { useToast } from "../../contexts/ToastContext"
import { Anchor, Loader2, AlertCircle } from "lucide-react"
import "./AuthPages.css"
import { apiClient } from "../../utils/ApiClient"

interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    email: string
    role: string
    avatar?: string
    bio?: string
  }
}

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { login } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await apiClient.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      })

      localStorage.setItem("token", response.token)

      localStorage.setItem("user", JSON.stringify(response.user))

      await login(email, password)

      showToast({
        title: "Login successful",
        description: "Welcome back to Battleship Online!",
        variant: "success",
      })

      navigate("/")
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        (error instanceof Error
          ? error.message
          : "Please check your credentials and try again")

      setErrorMessage(errorMessage)

      showToast({
        title: "Login failed",
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
            <Anchor className="mx-auto mb-2 h-12 w-12 text-[#4ECDC4]" />{" "}
            <h1 className="text-2xl font-bold">Login to Battleship Online</h1>
            <p className="mt-2 text-[#A3BFFA]">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="rounded-lg bg-[#2D3748] p-6 shadow-lg">
            {errorMessage && (
              <div className="mb-4 p-3 bg-[#FF6B6B]/20 border border-[#FF6B6B] rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 text-[#FF6B6B] mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="bg-[#1A2A44] border-[#4A4A4A] text-[#F5F7FA] placeholder:text-[#A3BFFA]"
                  placeholder="Enter your email"
                />
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
                  className="bg-[#1A2A44] border-[#4A4A4A] text-[#F5F7FA] placeholder:text-[#A3BFFA]"
                  placeholder="Enter your password"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#4ECDC4] hover:bg-[#4ECDC4]/90 text-[#F5F7FA]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              <p className="text-[#A3BFFA]">
                Don&apos;t have an account?{" "}
                <Link
                  to="/auth/register"
                  className="text-[#4ECDC4] hover:underline"
                >
                  Register
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
