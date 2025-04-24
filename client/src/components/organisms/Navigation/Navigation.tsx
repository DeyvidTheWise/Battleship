"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../../contexts/AuthContext"
import { Button } from "../../../components/atoms/Button/Button"
import { User, LogOut, Menu, X } from "lucide-react"
import "./Navigation.css"

export default function Navigation() {
  const { user, logout, isAdmin } = useAuth()
  console.log("Auth user in Navigation:", user) // Add this line to debug
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  return (
    <nav className="bg-[#1A2A44] text-[#F5F7FA] p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold flex items-center">
          <svg
            className="mr-2 h-5 w-5 text-[#4ECDC4]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z" />
            <path d="M12 2v20" />
            <path d="M2 12h20" />
          </svg>
          Battleship
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/game/ai" className="text-[#A3BFFA] hover:text-[#4ECDC4]">
            Play
          </Link>
          <Link
            to="/leaderboard"
            className="text-[#A3BFFA] hover:text-[#4ECDC4]"
          >
            Leaderboard
          </Link>
          <Link
            to="/tournaments"
            className="text-[#A3BFFA] hover:text-[#4ECDC4]"
          >
            Tournaments
          </Link>
          <Link to="/news" className="text-[#A3BFFA] hover:text-[#4ECDC4]">
            News
          </Link>
          {user && (
            <>
              <Link
                to="/social"
                className="text-[#A3BFFA] hover:text-[#4ECDC4]"
              >
                Social
              </Link>
              <Link to="/chat" className="text-[#A3BFFA] hover:text-[#4ECDC4]">
                Chat
              </Link>
              <Link
                to="/friends"
                className="text-[#A3BFFA] hover:text-[#4ECDC4]"
              >
                Friends
              </Link>
            </>
          )}
          {isAdmin && (
            <Link to="/admin" className="text-[#FF6B6B] hover:text-[#FF8080]">
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-4">
              <Link to="/profile">
                <Button variant="ghost" size="sm" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  {user.username || user.id || "Profile"}
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/auth/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/auth/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden btn-svg"
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed top-[56px] left-0 right-0 bottom-0 bg-[#1A2A44] z-50 px-4 overflow-y-auto">
          <div className="flex flex-col space-y-4 py-4">
            <Link
              to="/game/ai"
              className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
              onClick={toggleMobileMenu}
            >
              Play
            </Link>
            <Link
              to="/leaderboard"
              className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
              onClick={toggleMobileMenu}
            >
              Leaderboard
            </Link>
            <Link
              to="/tournaments"
              className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
              onClick={toggleMobileMenu}
            >
              Tournaments
            </Link>
            <Link
              to="/news"
              className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
              onClick={toggleMobileMenu}
            >
              News
            </Link>

            {user && (
              <>
                <Link
                  to="/profile"
                  className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
                  onClick={toggleMobileMenu}
                >
                  <User className="inline-block mr-2 h-4 w-4" />
                  {user.username || "Profile"}
                </Link>
                <Link
                  to="/social"
                  className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
                  onClick={toggleMobileMenu}
                >
                  Social
                </Link>
                <Link
                  to="/chat"
                  className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
                  onClick={toggleMobileMenu}
                >
                  Chat
                </Link>
                <Link
                  to="/friends"
                  className="p-3 rounded hover:bg-[#2D3748] text-[#F5F7FA]"
                  onClick={toggleMobileMenu}
                >
                  Friends
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="p-3 rounded hover:bg-[#2D3748] text-[#FF6B6B]"
                onClick={toggleMobileMenu}
              >
                Admin
              </Link>
            )}

            {user ? (
              <Button
                variant="ghost"
                className="justify-start p-3 text-[#F5F7FA] hover:bg-[#2D3748] w-full text-left"
                onClick={() => {
                  logout()
                  toggleMobileMenu()
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <div className="flex flex-col space-y-3 pt-3">
                <Link to="/auth/login" onClick={toggleMobileMenu}>
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link to="/auth/register" onClick={toggleMobileMenu}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
