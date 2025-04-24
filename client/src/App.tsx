import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./contexts/ThemeContext"
import { AuthProvider } from "./contexts/AuthContext"
import { ToastProvider } from "./contexts/ToastContext"
import { GameProvider } from "./contexts/GameContext"
import Navigation from "./components/organisms/Navigation/Navigation"
import { Toaster } from "./components/atoms/Toaster/Toaster"
import "./App.css"

import LoginPage from "./views/Auth/LoginPage"
import RegisterPage from "./views/Auth/RegisterPage"

import HomePage from "./views/Home/HomePage"
import GamePage from "./views/Game/GamePage"
import LeaderboardPage from "./views/Leaderboard/LeaderboardPage"
import NewsPage from "./views/News/NewsPage"
import SocialPage from "./views/Social/SocialPage"
import ChatPage from "./views/Chat/ChatPage"
import FriendsPage from "./views/Friends/FriendsPage"
import NotFoundPage from "./views/NotFoundPage"

import TournamentsPage from "./views/Tournaments/TournamentsPage"
import TournamentDetailPage from "./views/Tournaments/TournamentDetailPage"

import ProfilePage from "./views/Profile/ProfilePage"
import EditProfilePage from "./views/Profile/EditProfilePage"

import AdminDashboardPage from "./views/Admin/DashboardPage"
import AdminNewsPage from "./views/Admin/NewsPage"
import AdminFaqsPage from "./views/Admin/FaqsPage"
import AdminTournamentsPage from "./views/Admin/TournamentsPage"
import AdminUsersPage from "./views/Admin/UsersPage"
import AdminSettingsPage from "./views/Admin/SettingsPage"

import ProtectedRoute from "./components/molecules/ProtectedRoute/ProtectedRoute"
import AdminRoute from "./components/molecules/AdminRoute/AdminRoute"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <GameProvider>
            <ToastProvider>
              <div className="app-container">
                <Navigation />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/auth/login" element={<LoginPage />} />
                    <Route path="/auth/register" element={<RegisterPage />} />
                    <Route path="/leaderboard" element={<LeaderboardPage />} />
                    <Route path="/news" element={<NewsPage />} />
                    <Route path="/tournaments" element={<TournamentsPage />} />
                    <Route
                      path="/tournaments/:id"
                      element={<TournamentDetailPage />}
                    />

                    <Route path="/game/:mode" element={<GamePage />} />

                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <ProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile/edit"
                      element={
                        <ProtectedRoute>
                          <EditProfilePage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/social"
                      element={
                        <ProtectedRoute>
                          <SocialPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/chat"
                      element={
                        <ProtectedRoute>
                          <ChatPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/friends"
                      element={
                        <ProtectedRoute>
                          <FriendsPage />
                        </ProtectedRoute>
                      }
                    />

                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminDashboardPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/news"
                      element={
                        <AdminRoute>
                          <AdminNewsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/faqs"
                      element={
                        <AdminRoute>
                          <AdminFaqsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/tournaments"
                      element={
                        <AdminRoute>
                          <AdminTournamentsPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <AdminUsersPage />
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/settings"
                      element={
                        <AdminRoute>
                          <AdminSettingsPage />
                        </AdminRoute>
                      }
                    />

                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
                <Toaster />
              </div>
            </ToastProvider>
          </GameProvider>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  )
}

export default App
