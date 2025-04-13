import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"
import { Text } from "../atoms/Text"
import { useAuth } from "../../context/AuthContext"
import {
  FaHome,
  FaHistory,
  FaGamepad,
  FaTrophy,
  FaUserPlus,
  FaSignInAlt,
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaUser,
  FaUsers,
} from "react-icons/fa"

// Type assertions for icons
const FaHomeIcon = FaHome as React.ComponentType
const FaHistoryIcon = FaHistory as React.ComponentType
const FaGamepadIcon = FaGamepad as React.ComponentType
const FaTrophyIcon = FaTrophy as React.ComponentType
const FaUserPlusIcon = FaUserPlus as React.ComponentType
const FaSignInAltIcon = FaSignInAlt as React.ComponentType
const FaBarsIcon = FaBars as React.ComponentType
const FaTimesIcon = FaTimes as React.ComponentType
const FaSignOutAltIcon = FaSignOutAlt as React.ComponentType
const FaUserIcon = FaUser as React.ComponentType
const FaUsersIcon = FaUsers as React.ComponentType

interface NavbarProps {
  onRegisterClick: () => void
  onLoginClick: () => void
  isHomePage?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  onRegisterClick,
  onLoginClick,
  isHomePage = false,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
    toggleMenu()
  }

  const handleProfileClick = () => {
    if (user) {
      navigate(`/profile/${user.id}`)
      toggleMenu()
    }
  }

  return (
    <nav className="navbar">
      <div className="container">
        <Text variant="h1">Battleship</Text>
        <div className={`nav-links ${isMenuOpen ? "active" : ""}`}>
          {isHomePage ? (
            <>
              <ScrollLink
                to="home"
                smooth={true}
                duration={500}
                onClick={toggleMenu}
              >
                <FaHomeIcon /> Home
              </ScrollLink>
              <ScrollLink
                to="history"
                smooth={true}
                duration={500}
                onClick={toggleMenu}
              >
                <FaHistoryIcon /> History
              </ScrollLink>
            </>
          ) : (
            <Link to="/" onClick={toggleMenu}>
              <FaHomeIcon /> Home
            </Link>
          )}
          <Link to="/lobby" onClick={toggleMenu}>
            <FaUsersIcon /> Game Lobby
          </Link>
          <Link to="/game?mode=single" onClick={toggleMenu}>
            <FaGamepadIcon /> Play vs AI
          </Link>
          <Link to="/leaderboard" onClick={toggleMenu}>
            <FaTrophyIcon /> Leaderboard
          </Link>
          {user ? (
            <>
              <button onClick={handleProfileClick}>
                <FaUserIcon /> {user.firstname}
              </button>
              <button onClick={handleLogout}>
                <FaSignOutAltIcon /> Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  onRegisterClick()
                  toggleMenu()
                }}
              >
                <FaUserPlusIcon /> Register
              </button>
              <button
                onClick={() => {
                  onLoginClick()
                  toggleMenu()
                }}
              >
                <FaSignInAltIcon /> Login
              </button>
            </>
          )}
        </div>
        <div className="burger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimesIcon /> : <FaBarsIcon />}
        </div>
      </div>
    </nav>
  )
}
