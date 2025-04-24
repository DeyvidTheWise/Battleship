"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import {
  Users,
  FileText,
  Award,
  Settings,
  BarChart2,
  TrendingUp,
  Database,
  MessageSquare,
} from "lucide-react"
import "./AdminPages.css"


const MOCK_STATS = {
  totalUsers: 1245,
  activeUsers: 782,
  gamesPlayed: 8976,
  tournamentsActive: 3,
  newUsersToday: 24,
  totalRevenue: "$4,582",
  serverUptime: "99.8%",
  averageGameTime: "12m 34s",
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState(MOCK_STATS)
  const [isLoading, setIsLoading] = useState(false)

  
  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        await new Promise((resolve) => setTimeout(resolve, 500))
      } catch (error) {
        console.error("Failed to fetch admin stats:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (!user || user.role !== "admin") {
    return (
      <div className="admin-container">
        <div className="bg-[#2D3748] rounded-lg p-6 text-center">
          <h1 className="text-2xl font-bold text-[#FF6B6B] mb-4">
            Access Denied
          </h1>
          <p className="text-[#A3BFFA]">
            You do not have permission to access the admin dashboard.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="admin-title">Admin Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-[#A3BFFA]">Welcome, {user.username}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-[#2D3748] rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A3BFFA] text-sm">Total Users</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.totalUsers}
              </h3>
            </div>
            <div className="bg-[#4ECDC4]/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-[#4ECDC4]" />
            </div>
          </div>
          <div className="mt-2 text-xs text-[#4ECDC4] flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            <span>+{stats.newUsersToday} today</span>
          </div>
        </div>

        <div className="bg-[#2D3748] rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A3BFFA] text-sm">Games Played</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.gamesPlayed}
              </h3>
            </div>
            <div className="bg-[#FF6B6B]/20 p-3 rounded-full">
              <BarChart2 className="h-6 w-6 text-[#FF6B6B]" />
            </div>
          </div>
          <div className="mt-2 text-xs text-[#FF6B6B] flex items-center">
            <span>Avg. time: {stats.averageGameTime}</span>
          </div>
        </div>

        <div className="bg-[#2D3748] rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A3BFFA] text-sm">Active Tournaments</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.tournamentsActive}
              </h3>
            </div>
            <div className="bg-[#A3BFFA]/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-[#A3BFFA]" />
            </div>
          </div>
          <div className="mt-2 text-xs text-[#A3BFFA] flex items-center">
            <span>Next tournament in 2 days</span>
          </div>
        </div>

        <div className="bg-[#2D3748] rounded-lg p-4 shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#A3BFFA] text-sm">Server Status</p>
              <h3 className="text-2xl font-bold text-white">
                {stats.serverUptime}
              </h3>
            </div>
            <div className="bg-[#4ECDC4]/20 p-3 rounded-full">
              <Database className="h-6 w-6 text-[#4ECDC4]" />
            </div>
          </div>
          <div className="mt-2 text-xs text-[#4ECDC4] flex items-center">
            <span>Uptime last 30 days</span>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-[#4ECDC4]">
        Admin Modules
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Link
          to="/admin/users"
          className="bg-[#2D3748] rounded-lg p-6 hover:bg-[#1A2A44] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#4ECDC4]/20 p-3 rounded-full">
              <Users className="h-6 w-6 text-[#4ECDC4]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">User Management</h3>
              <p className="text-sm text-[#A3BFFA]">
                Manage user accounts and permissions
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/news"
          className="bg-[#2D3748] rounded-lg p-6 hover:bg-[#1A2A44] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#FF6B6B]/20 p-3 rounded-full">
              <FileText className="h-6 w-6 text-[#FF6B6B]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">News Management</h3>
              <p className="text-sm text-[#A3BFFA]">
                Create and manage news articles
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/tournaments"
          className="bg-[#2D3748] rounded-lg p-6 hover:bg-[#1A2A44] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#A3BFFA]/20 p-3 rounded-full">
              <Award className="h-6 w-6 text-[#A3BFFA]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">
                Tournament Management
              </h3>
              <p className="text-sm text-[#A3BFFA]">
                Create and manage tournaments
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/faqs"
          className="bg-[#2D3748] rounded-lg p-6 hover:bg-[#1A2A44] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#4ECDC4]/20 p-3 rounded-full">
              <MessageSquare className="h-6 w-6 text-[#4ECDC4]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">FAQ Management</h3>
              <p className="text-sm text-[#A3BFFA]">
                Manage frequently asked questions
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-[#2D3748] rounded-lg p-6 hover:bg-[#1A2A44] transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="bg-[#A3BFFA]/20 p-3 rounded-full">
              <Settings className="h-6 w-6 text-[#A3BFFA]" />
            </div>
            <div>
              <h3 className="font-semibold text-white">System Settings</h3>
              <p className="text-sm text-[#A3BFFA]">
                Configure system settings
              </p>
            </div>
          </div>
        </Link>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-[#4ECDC4]">
        Recent Activity
      </h2>
      <div className="bg-[#2D3748] rounded-lg p-4 shadow-md">
        <table className="w-full">
          <thead>
            <tr className="text-left border-b border-[#4A4A4A]">
              <th className="p-2 text-[#A3BFFA]">Action</th>
              <th className="p-2 text-[#A3BFFA]">User</th>
              <th className="p-2 text-[#A3BFFA]">Time</th>
              <th className="p-2 text-[#A3BFFA]">Details</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[#4A4A4A]">
              <td className="p-2">User Created</td>
              <td className="p-2">admin</td>
              <td className="p-2">2 hours ago</td>
              <td className="p-2">Created user 'player123'</td>
            </tr>
            <tr className="border-b border-[#4A4A4A]">
              <td className="p-2">Tournament Created</td>
              <td className="p-2">admin</td>
              <td className="p-2">3 hours ago</td>
              <td className="p-2">Created 'Summer Championship'</td>
            </tr>
            <tr className="border-b border-[#4A4A4A]">
              <td className="p-2">News Published</td>
              <td className="p-2">admin</td>
              <td className="p-2">5 hours ago</td>
              <td className="p-2">Published 'New Game Features'</td>
            </tr>
            <tr>
              <td className="p-2">FAQ Added</td>
              <td className="p-2">admin</td>
              <td className="p-2">1 day ago</td>
              <td className="p-2">Added 'How to play' FAQ</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DashboardPage
