"use client"

import type React from "react"
import { Link } from "react-router-dom"
import { Button } from "../components/atoms/Button/Button"
import { Home, ArrowLeft } from "lucide-react"

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-bold text-[#4ECDC4] mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
      <p className="text-[#A3BFFA] max-w-md mb-8">The page you're looking for doesn't exist or has been moved.</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/">
          <Button className="flex items-center">
            <Home className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
