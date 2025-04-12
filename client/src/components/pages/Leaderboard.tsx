import React, { useEffect, useState } from "react"
import { Text } from "../atoms/Text"
import { Button } from "../atoms/Button"
import { Navbar } from "../organisms/Navbar"

interface LeaderboardEntry {
  username: string
  xp: number
}

const Leaderboard: React.FC = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
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

  useEffect(() => {
    fetch("http://localhost:5000/api/leaderboard")
      .then((res) => res.json())
      .then((data) => setLeaderboard(data))
      .catch((err) => console.error("Failed to fetch leaderboard:", err))
  }, [])

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerData),
      })
      if (!response.ok) throw new Error("Registration failed")
      setShowRegister(false)
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
    } catch (err) {
      setError((err as Error).message)
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar
        onRegisterClick={() => setShowRegister(true)}
        onLoginClick={() => setShowLogin(true)}
      />
      <div style={{ paddingTop: "5rem", padding: "1.5rem" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Text
            variant="h1"
            style={{
              textAlign: "center",
              marginBottom: "1.5rem",
              color: "#fff",
            }}
          >
            Leaderboard
          </Text>
          {leaderboard.length > 0 ? (
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>XP</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{entry.username}</td>
                    <td>{entry.xp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Text style={{ textAlign: "center" }}>
              No leaderboard data available.
            </Text>
          )}
        </div>
      </div>

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

export default Leaderboard
