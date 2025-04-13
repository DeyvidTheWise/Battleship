// client/src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/pages/Home"
import GamePage from "./components/pages/Game"
import GameLobby from "./components/pages/GameLobby"
import Leaderboard from "./components/pages/Leaderboard"
import Profile from "./components/pages/Profile"
import { AuthProvider } from "./context/AuthContext"
import RequireAuth from "./hocs/RequireAuth"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/lobby"
            element={
              <RequireAuth>
                <GameLobby />
              </RequireAuth>
            }
          />
          <Route path="/game" element={<GamePage />} />{" "}
          {/* Removed RequireAuth */}
          <Route
            path="/leaderboard"
            element={
              <RequireAuth>
                <Leaderboard />
              </RequireAuth>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
