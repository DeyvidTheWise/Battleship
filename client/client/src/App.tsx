import React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import {
  Homepage,
  GameScreen,
  ProfilePage,
  LeaderboardsPage,
  CMSDashboard,
  Login,
  Register,
  Settings,
  FAQsTutorials,
} from "pages"

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaderboards" element={<LeaderboardsPage />} />
        <Route path="/cms" element={<CMSDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/faqs" element={<FAQsTutorials />} />
      </Routes>
    </Router>
  )
}

export default App
