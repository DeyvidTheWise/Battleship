import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Navbar } from "./"
import LoginModal from "./LoginModal"
import RegisterModal from "./RegisterModal"

interface PageLayoutProps {
  children: React.ReactNode
  showNavbar?: boolean
  isHomePage?: boolean
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showNavbar = true,
  isHomePage = false,
}) => {
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const handleLoginSuccess = () => {
    setShowLogin(false)
    navigate("/game?mode=single") // Ensure redirect to single-player mode
  }

  const handleRegisterSuccess = () => {
    setShowRegister(false)
    navigate("/game?mode=single") // Ensure redirect to single-player mode
  }

  return (
    <div style={{ minHeight: "100vh", paddingTop: "5.5rem" }}>
      {showNavbar && (
        <Navbar
          onRegisterClick={() => setShowRegister(true)}
          onLoginClick={() => setShowLogin(true)}
          isHomePage={isHomePage}
        />
      )}
      <div
        style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 1.5rem" }}
      >
        {children}
      </div>
      <RegisterModal
        isOpen={showRegister}
        onClose={() => setShowRegister(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  )
}

export default PageLayout
