import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Link as ScrollLink } from "react-scroll"
import { Text } from "../atoms/Text"
import {
  FaHome,
  FaHistory,
  FaGamepad,
  FaTrophy,
  FaUserPlus,
  FaSignInAlt,
  FaBars,
  FaTimes,
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
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
          <Link to="/game?mode=single" onClick={toggleMenu}>
            <FaGamepadIcon /> Play vs AI
          </Link>
          <Link to="/leaderboard" onClick={toggleMenu}>
            <FaTrophyIcon /> Leaderboard
          </Link>
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
        </div>
        <div className="burger" onClick={toggleMenu}>
          {isMenuOpen ? <FaTimesIcon /> : <FaBarsIcon />}
        </div>
      </div>
    </nav>
  )
}
