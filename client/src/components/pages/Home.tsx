import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Text } from "../atoms/Text"
import { Button } from "../atoms/Button"
import { Link as ScrollLink } from "react-scroll"
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

const Home: React.FC = () => {
  const navigate = useNavigate()
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [registerData, setRegisterData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  })
  const [loginData, setLoginData] = useState({ email: "", password: "" })
  const [error, setError] = useState<string | null>(null)

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })
      if (!response.ok) throw new Error("Registration failed")
      setShowRegister(false)
      navigate("/game")
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      })
      if (!response.ok) throw new Error("Login failed")
      setShowLogin(false)
      navigate("/game")
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container">
          <Text variant="h1">Battleship</Text>
          <div className="nav-links">
            <ScrollLink to="home" smooth={true} duration={500}>
              <FaHomeIcon /> Home
            </ScrollLink>
            <ScrollLink to="history" smooth={true} duration={500}>
              <FaHistoryIcon /> History
            </ScrollLink>
            <Link to="/game?mode=single">
              <FaGamepadIcon /> Play vs AI
            </Link>
            <Link to="/leaderboard">
              <FaTrophyIcon /> Leaderboard
            </Link>
            <button onClick={() => setShowRegister(true)}>
              <FaUserPlusIcon /> Register
            </button>
            <button onClick={() => setShowLogin(true)}>
              <FaSignInAltIcon /> Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        id="home"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "url('/images/hero-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          style={{
            background: "rgba(0, 0, 0, 0.7)",
            padding: "2rem",
            borderRadius: "10px",
            textAlign: "center",
          }}
        >
          <Text variant="h1" style={{ color: "#fff", marginBottom: "1rem" }}>
            Welcome to Battleship
          </Text>
          <Text variant="p" style={{ color: "#fff", marginBottom: "1.5rem" }}>
            Sink your opponent's ships in this classic naval strategy game!
          </Text>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            <Button onClick={() => navigate("/game?mode=single")}>
              Play vs AI
            </Button>
            <Button onClick={() => navigate("/game")} variant="secondary">
              Play Multiplayer
            </Button>
          </div>
        </div>
      </section>

      {/* History Section */}
      <section
        id="history"
        style={{
          padding: "4rem 1rem",
          background: "linear-gradient(to bottom, #2a406e, #1a2a6c)",
        }}
      >
        <div
          style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 1rem" }}
        >
          <Text
            variant="h2"
            style={{ textAlign: "center", marginBottom: "2rem", color: "#fff" }}
          >
            History of Battleship
          </Text>
          <Text variant="p" style={{ marginBottom: "1rem" }}>
            Battleship, also known as "Sea Battle," is a strategy guessing game
            for two players. It originated as a pencil-and-paper game in the
            early 20th century, with its roots tracing back to World War I. The
            game was first published as a board game by Milton Bradley in 1943
            under the name "Broadsides, the Game of Naval Strategy."
          </Text>
          <Text variant="p" style={{ marginBottom: "1rem" }}>
            The modern version of Battleship, as we know it today, was released
            in 1967, featuring plastic pegboards and ships. Players place their
            fleet of ships on a grid and take turns guessing coordinates to
            "hit" and "sink" their opponent's ships. The game became a global
            phenomenon, inspiring numerous adaptations, including electronic
            versions, mobile apps, and now this online multiplayer version.
          </Text>
          <Text variant="p">
            Battleship is a timeless game that combines strategy, luck, and
            deduction, making it a favorite for generations of players
            worldwide.
          </Text>
        </div>
      </section>

      {/* Register/Login Modals */}
      {showRegister && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Text variant="h2" style={{ marginBottom: "1rem" }}>
              Register
            </Text>
            {error && (
              <Text style={{ color: "#ff4444", marginBottom: "0.5rem" }}>
                {error}
              </Text>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <input
                type="text"
                placeholder="First Name"
                value={registerData.firstname}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    firstname: e.target.value,
                  })
                }
              />
              <input
                type="text"
                placeholder="Last Name"
                value={registerData.lastname}
                onChange={(e) =>
                  setRegisterData({ ...registerData, lastname: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) =>
                  setRegisterData({ ...registerData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button onClick={handleRegister}>Submit</Button>
                <Button onClick={() => setShowRegister(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLogin && (
        <div className="modal-overlay">
          <div className="modal-content">
            <Text variant="h2" style={{ marginBottom: "1rem" }}>
              Login
            </Text>
            {error && (
              <Text style={{ color: "#ff4444", marginBottom: "0.5rem" }}>
                {error}
              </Text>
            )}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <Button onClick={handleLogin}>Submit</Button>
                <Button onClick={() => setShowLogin(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
