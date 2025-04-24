"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import { Button } from "../../components/atoms/Button/Button"
import { Input } from "../../components/atoms/Input/Input"
import { Textarea } from "../../components/atoms/TextArea/TextArea"
import { User, Mail, Shield } from "lucide-react"
import "./EditProfilePage.css"

interface ProfileFormData {
  username: string
  email: string
  bio: string
  avatar: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    username: "",
    email: "",
    bio: "",
    avatar: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        bio: user.bio || "",
        avatar: user.avatar || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      showToast({
        title: "Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      })
      return
    }

    if (formData.newPassword) {
      if (!formData.currentPassword) {
        showToast({
          title: "Error",
          description: "Current password is required to set a new password",
          variant: "destructive",
        })
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        showToast({
          title: "Error",
          description: "New passwords do not match",
          variant: "destructive",
        })
        return
      }
    }

    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      updateUser({
        ...user,
        username: formData.username,
        email: formData.email,
        bio: formData.bio,
        avatar: formData.avatar,
      })

      showToast({
        title: "Success",
        description: "Profile updated successfully",
        variant: "success",
      })

      navigate("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
      showToast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="edit-profile-container">
        <div className="edit-profile-card">
          <h1>Not Authorized</h1>
          <div className="edit-profile-form">
            <p>You must be logged in to edit your profile.</p>
            <div className="form-actions">
              <Button onClick={() => navigate("/login")}>Go to Login</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit} className="edit-profile-form">
          <div className="form-section public">
            <div className="section-header">
              <User className="section-icon" size={20} />
              <div>
                <h2 className="section-title">Public Information</h2>
                <p className="section-description">
                  This information will be visible to other users
                </p>
              </div>
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <Input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
              </div>

              <div className="form-group">
                <label htmlFor="avatar">Avatar URL</label>
                <Input
                  type="text"
                  id="avatar"
                  name="avatar"
                  value={formData.avatar}
                  onChange={handleChange}
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
                {formData.avatar && (
                  <div className="avatar-preview">
                    <img
                      src={formData.avatar || "/placeholder.svg"}
                      alt="Avatar preview"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                        e.currentTarget.parentElement!.textContent =
                          formData.username.charAt(0).toUpperCase()
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-section account">
            <div className="section-header">
              <Mail className="section-icon" size={20} />
              <div>
                <h2 className="section-title">Account Details</h2>
                <p className="section-description">
                  Information used for account management
                </p>
              </div>
            </div>
            <div className="form-section-content">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bio">Bio</label>
                <Textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
              </div>
            </div>
          </div>

          <div className="form-section security">
            <div className="section-header">
              <Shield className="section-icon" size={20} />
              <div>
                <h2 className="section-title">Security Settings</h2>
                <p className="section-description">
                  Update your password and security preferences
                </p>
              </div>
            </div>
            <div className="form-section-content security">
              <div className="form-group">
                <label htmlFor="currentPassword">Current Password</label>
                <Input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <Input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <Input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="bg-[#1a2a44] border-[#2a3a54] text-[#f5f7fa]"
                />
              </div>
            </div>
          </div>

          <div className="form-actions">
            <Button
              type="button"
              onClick={() => navigate("/profile")}
              className="cancel-button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#4ecdc4] text-[#1a2a44] hover:bg-[#3dbdb5]"
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditProfilePage
