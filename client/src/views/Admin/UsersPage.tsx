"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { Button } from "../../components/atoms/Button/Button"
import { Input } from "../../components/atoms/Input/Input"
import {
  Search,
  UserPlus,
  Edit,
  Trash2,
  Shield,
  ShieldOff,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import "./AdminPages.css"


const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    email: "admin@battleship.com",
    role: "admin",
    created_at: "2023-01-01",
    last_login: "2023-06-15",
    status: "active",
    games_played: 45,
    win_rate: 68,
  },
  {
    id: 2,
    username: "player1",
    email: "player1@example.com",
    role: "user",
    created_at: "2023-02-15",
    last_login: "2023-06-14",
    status: "active",
    games_played: 120,
    win_rate: 52,
  },
  {
    id: 3,
    username: "player2",
    email: "player2@example.com",
    role: "user",
    created_at: "2023-03-20",
    last_login: "2023-06-10",
    status: "inactive",
    games_played: 85,
    win_rate: 47,
  },
  {
    id: 4,
    username: "moderator",
    email: "mod@example.com",
    role: "admin",
    created_at: "2023-01-10",
    last_login: "2023-06-15",
    status: "active",
    games_played: 67,
    win_rate: 73,
  },
  {
    id: 5,
    username: "player3",
    email: "player3@example.com",
    role: "user",
    created_at: "2023-04-05",
    last_login: "2023-06-01",
    status: "banned",
    games_played: 32,
    win_rate: 41,
  },
]

interface User {
  id: number
  username: string
  email: string
  role: string
  created_at: string
  last_login: string
  status: string
  games_played: number
  win_rate: number
}

interface UserFormData {
  username: string
  email: string
  role: string
  password?: string
  status: string
}

const UsersPage: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [filteredUsers, setFilteredUsers] = useState<User[]>(MOCK_USERS)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [showEditUserModal, setShowEditUserModal] = useState(false)
  const [showDeleteUserModal, setShowDeleteUserModal] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [formData, setFormData] = useState<UserFormData>({
    username: "",
    email: "",
    role: "user",
    password: "",
    status: "active",
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage] = useState(10)
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true)
      try {
        
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        
        
      } catch (error) {
        console.error("Failed to fetch users:", error)
        showToast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [showToast])

  
  useEffect(() => {
    let result = users

    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (roleFilter !== "all") {
      result = result.filter((user) => user.role === roleFilter)
    }

    if (statusFilter !== "all") {
      result = result.filter((user) => user.status === statusFilter)
    }

    setFilteredUsers(result)
  }, [users, searchTerm, roleFilter, statusFilter])

  
  const indexOfLastUser = currentPage * usersPerPage
  const indexOfFirstUser = indexOfLastUser - usersPerPage
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

  const handleAddUser = () => {
    setFormData({
      username: "",
      email: "",
      role: "user",
      password: "",
      status: "active",
    })
    setShowAddUserModal(true)
  }

  const handleEditUser = (user: User) => {
    setCurrentUser(user)
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
    })
    setShowEditUserModal(true)
  }

  const handleDeleteUser = (user: User) => {
    setCurrentUser(user)
    setShowDeleteUserModal(true)
  }

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 500))

      
      

      
      const newUser: User = {
        id: users.length + 1,
        username: formData.username,
        email: formData.email,
        role: formData.role,
        created_at: new Date().toISOString().split("T")[0],
        last_login: "-",
        status: formData.status,
        games_played: 0,
        win_rate: 0,
      }

      setUsers([...users, newUser])
      setShowAddUserModal(false)

      showToast({
        title: "Success",
        description: "User added successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to add user:", error)
      showToast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) return

    setIsLoading(true)

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 500))

      
      

      
      const updatedUsers = users.map((user) =>
        user.id === currentUser.id
          ? {
              ...user,
              username: formData.username,
              email: formData.email,
              role: formData.role,
              status: formData.status,
            }
          : user
      )

      setUsers(updatedUsers)
      setShowEditUserModal(false)

      showToast({
        title: "Success",
        description: "User updated successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to update user:", error)
      showToast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!currentUser) return

    setIsLoading(true)

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 500))

      
      

      
      const updatedUsers = users.filter((user) => user.id !== currentUser.id)
      setUsers(updatedUsers)
      setShowDeleteUserModal(false)

      showToast({
        title: "Success",
        description: "User deleted successfully",
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to delete user:", error)
      showToast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleRole = async (userId: number, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 500))

      
      

      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, role: newRole } : user
      )

      setUsers(updatedUsers)

      showToast({
        title: "Success",
        description: `User role updated to ${newRole}`,
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to update user role:", error)
      showToast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (userId: number, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active"

    try {
      
      await new Promise((resolve) => setTimeout(resolve, 500))

      
      

      
      const updatedUsers = users.map((user) =>
        user.id === userId ? { ...user, status: newStatus } : user
      )

      setUsers(updatedUsers)

      showToast({
        title: "Success",
        description: `User status updated to ${newStatus}`,
        variant: "success",
      })
    } catch (error) {
      console.error("Failed to update user status:", error)
      showToast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

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
        <h1 className="admin-title">User Management</h1>
        <Button onClick={handleAddUser} className="bg-[#4ECDC4] text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-[#2D3748] rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#A3BFFA]"
              size={18}
            />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-[#1A2A44] border-[#4A4A4A] text-white"
            />
          </div>
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#1A2A44] border border-[#4A4A4A] text-white rounded-md px-3 py-2"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1A2A44] border border-[#4A4A4A] text-white rounded-md px-3 py-2"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="banned">Banned</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#2D3748] rounded-lg overflow-hidden shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#1A2A44] text-left">
                <th className="p-4 text-[#A3BFFA]">ID</th>
                <th className="p-4 text-[#A3BFFA]">Username</th>
                <th className="p-4 text-[#A3BFFA]">Email</th>
                <th className="p-4 text-[#A3BFFA]">Role</th>
                <th className="p-4 text-[#A3BFFA]">Status</th>
                <th className="p-4 text-[#A3BFFA]">Created</th>
                <th className="p-4 text-[#A3BFFA]">Last Login</th>
                <th className="p-4 text-[#A3BFFA]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#4ECDC4]"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              ) : currentUsers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-[#A3BFFA]">
                    No users found
                  </td>
                </tr>
              ) : (
                currentUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-t border-[#4A4A4A] hover:bg-[#1A2A44]"
                  >
                    <td className="p-4">{user.id}</td>
                    <td className="p-4">{user.username}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span
                        className={
                          `px-2 py-1 rounded-full text-xs ${
                            user.role === "admin"
                              ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                              : "bg-[#4ECDC4]/20 text-[#4ECDC4]"
                          }`
                            ? "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                            : "bg-[#4ECDC4]/20 text-[#4ECDC4]"
                        }
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.status === "active"
                            ? "bg-[#4ECDC4]/20 text-[#4ECDC4]"
                            : user.status === "inactive"
                            ? "bg-[#A3BFFA]/20 text-[#A3BFFA]"
                            : "bg-[#FF6B6B]/20 text-[#FF6B6B]"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="p-4">{user.created_at}</td>
                    <td className="p-4">{user.last_login}</td>
                    <td className="p-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleToggleRole(user.id, user.role)}
                          className="p-1 rounded hover:bg-[#4A4A4A]"
                          title={
                            user.role === "admin"
                              ? "Remove admin role"
                              : "Make admin"
                          }
                        >
                          {user.role === "admin" ? (
                            <ShieldOff size={18} className="text-[#FF6B6B]" />
                          ) : (
                            <Shield size={18} className="text-[#4ECDC4]" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.status)
                          }
                          className="p-1 rounded hover:bg-[#4A4A4A]"
                          title={
                            user.status === "active"
                              ? "Deactivate user"
                              : "Activate user"
                          }
                        >
                          {user.status === "active" ? (
                            <X size={18} className="text-[#FF6B6B]" />
                          ) : (
                            <Check size={18} className="text-[#4ECDC4]" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditUser(user)}
                          className="p-1 rounded hover:bg-[#4A4A4A]"
                          title="Edit user"
                        >
                          <Edit size={18} className="text-[#A3BFFA]" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user)}
                          className="p-1 rounded hover:bg-[#4A4A4A]"
                          title="Delete user"
                        >
                          <Trash2 size={18} className="text-[#FF6B6B]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredUsers.length > usersPerPage && (
          <div className="flex justify-between items-center p-4 border-t border-[#4A4A4A]">
            <div className="text-sm text-[#A3BFFA]">
              Showing {indexOfFirstUser + 1} to{" "}
              {Math.min(indexOfLastUser, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-[#1A2A44] text-[#A3BFFA] disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 ${
                      currentPage === page
                        ? "bg-[#4ECDC4] text-[#1A2A44]"
                        : "bg-[#1A2A44] text-[#A3BFFA]"
                    }`}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="p-2 bg-[#1A2A44] text-[#A3BFFA] disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D3748] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New User</h2>
            <form onSubmit={handleSubmitAddUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#1A2A44] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#1A2A44] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#1A2A44] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full bg-[#1A2A44] border border-[#4A4A4A] text-white rounded-md px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-[#1A2A44] border border-[#4A4A4A] text-white rounded-md px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="bg-transparent border border-[#4A4A4A] text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#4ECDC4] text-white"
                >
                  {isLoading ? "Adding..." : "Add User"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditUserModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D3748] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Edit User</h2>
            <form onSubmit={handleSubmitEditUser}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Username
                  </label>
                  <Input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#1A2A44] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="w-full bg-[#1A2A44] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <Input
                    type="password"
                    name="password"
                    value={formData.password || ""}
                    onChange={handleFormChange}
                    className="w-full bg-[#1A2A44] border-[#4A4A4A] text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleFormChange}
                    className="w-full bg-[#1A2A44] border border-[#4A4A4A] text-white rounded-md px-3 py-2"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFormChange}
                    className="w-full bg-[#1A2A44] border border-[#4A4A4A] text-white rounded-md px-3 py-2"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="banned">Banned</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                  className="bg-transparent border border-[#4A4A4A] text-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#4ECDC4] text-white"
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteUserModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2D3748] rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Delete User</h2>
            <p className="mb-4">
              Are you sure you want to delete the user{" "}
              <span className="font-semibold">{currentUser.username}</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                onClick={() => setShowDeleteUserModal(false)}
                className="bg-transparent border border-[#4A4A4A] text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="bg-[#FF6B6B] text-white"
              >
                {isLoading ? "Deleting..." : "Delete User"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UsersPage
