


export type UserRole = "user" | "admin" | "moderator"


export type UserStatus = "active" | "inactive" | "banned" | "pending"


export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  role: UserRole
  status?: UserStatus
  createdAt?: string
  lastLogin?: string
}


export interface UserProfile extends User {
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    twitter?: string
    discord?: string
    github?: string
  }
  preferences?: UserPreferences
}


export interface UserPreferences {
  theme: "light" | "dark" | "system"
  notifications: {
    email: boolean
    push: boolean
    friendRequests: boolean
    gameInvites: boolean
    achievements: boolean
  }
  privacy: {
    showOnlineStatus: boolean
    showGameHistory: boolean
    allowFriendRequests: boolean
  }
}


export interface AuthCredentials {
  email: string
  password: string
}


export interface RegistrationData extends AuthCredentials {
  username: string
  confirmPassword: string
}


export interface AuthResponse {
  user: User
  token: string
  expiresAt?: number
}


export interface Friend {
  id: number
  username: string
  avatar?: string
  status: "online" | "offline" | "in-game"
  lastActive?: string
}


export interface FriendRequest {
  id: number
  sender: User
  recipient: User
  status: "pending" | "accepted" | "rejected"
  createdAt: string
}


export * from "../utils/Types"
