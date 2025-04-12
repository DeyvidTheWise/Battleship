import React from "react"
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
} from "react-icons/fa"

// Type assertions for icons
const FaHomeIcon = FaHome as React.ComponentType
const FaHistoryIcon = FaHistory as React.ComponentType
const FaGamepadIcon = FaGamepad as React.ComponentType
const FaTrophyIcon = FaTrophy as React.ComponentType
const FaUserPlusIcon = FaUserPlus as React.ComponentType
const FaSignInAltIcon = FaSignInAlt as React.ComponentType

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
  return (
    <nav className="navbar">
      <div className="container">
        <Text variant="h1">Battleship</Text>
        <div className="nav-links">
          {isHomePage ? (
            <>
              <ScrollLink to="home" smooth={true} duration={500}>
                <FaHomeIcon /> Home
              </ScrollLink>
              <ScrollLink to="history" smooth={true} duration={500}>
                <FaHistoryIcon /> History
              </ScrollLink>
            </>
          ) : (
            <Link to="/">
              <FaHomeIcon /> Home
            </Link>
          )}
          <Link to="/game?mode=single">
            <FaGamepadIcon /> Play vs AI
          </Link>
          <Link to="/leaderboard">
            <FaTrophyIcon /> Leaderboard
          </Link>
          <button onClick={onRegisterClick}>
            <FaUserPlusIcon /> Register
          </button>
          <button onClick={onLoginClick}>
            <FaSignInAltIcon /> Login
          </button>
        </div>
      </div>
    </nav>
  )
}
