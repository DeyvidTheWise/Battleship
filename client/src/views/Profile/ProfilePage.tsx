"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { Button } from "../../components/atoms/Button/Button"
import { Edit, Calendar, MapPin, LinkIcon } from "lucide-react"
import "./ProfilePage.css"

interface Post {
  id: string
  content: string
  timestamp: Date
  image?: string
  likes: number
  comments: number
  retweets: number
}

const ProfilePage: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("posts")

  const posts: Post[] = [
    {
      id: "1",
      content:
        "Just reached a 10-game winning streak! My strategy of placing ships along the edges is really paying off. #Battleship #Gaming",
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      image: "/clash-of-ironclads.png",
      likes: 42,
      comments: 7,
      retweets: 5,
    },
    {
      id: "2",
      content:
        "Does anyone have tips for beating the AI on hard mode? It seems to know exactly where my ships are! 🤔 #AskingForHelp",
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      likes: 18,
      comments: 12,
      retweets: 2,
    },
    {
      id: "3",
      content:
        "Just unlocked the 'Fleet Commander' achievement! 10 wins in a row! 🏆 #Achievement #Milestone",
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      image: "/golden-victory-cup.png",
      likes: 76,
      comments: 15,
      retweets: 8,
    },
    {
      id: "4",
      content:
        "Check out my new ship placement strategy. I call it 'The Fortress'. Works great against aggressive players! #Strategy #Tips",
      timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
      image: "/strategic-battleship-grid.png",
      likes: 54,
      comments: 23,
      retweets: 12,
    },
  ]

  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-card">
          <h1>Not Authorized</h1>
          <p>You must be logged in to view your profile.</p>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </div>
      </div>
    )
  }

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const getInitials = (name: string): string => {
    return name.charAt(0).toUpperCase()
  }

  return (
    <div className="modern-profile-container">
      {/* Profile Sidebar */}
      <div className="profile-sidebar">
        <div className="profile-avatar-container">
          {user.avatar ? (
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={`${user.username}'s avatar`}
              className="profile-avatar-img"
              onError={(e) => {
                e.currentTarget.style.display = "none"
                e.currentTarget.parentElement!.classList.add("avatar-fallback")
                e.currentTarget.parentElement!.textContent = getInitials(
                  user.username
                )
              }}
            />
          ) : (
            <div className="avatar-fallback">{getInitials(user.username)}</div>
          )}
        </div>

        <div className="profile-info">
          <h1 className="profile-name">{user.username}</h1>
          <p className="profile-username">@{user.username.toLowerCase()}</p>

          <p className="profile-bio">{user.bio || "No bio provided"}</p>

          <div className="profile-metadata">
            <div className="profile-meta-item">
              <Calendar size={16} />
              <span>Joined {formatDate(new Date(2023, 0, 15))}</span>
            </div>
            <div className="profile-meta-item">
              <MapPin size={16} />
              <span>Battleship World</span>
            </div>
            <div className="profile-meta-item">
              <LinkIcon size={16} />
              <span>battleship.game/profile/{user.username.toLowerCase()}</span>
            </div>
          </div>

          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-value">{user.stats.gamesPlayed}</span>
              <span className="stat-label">Games</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">{user.stats.wins}</span>
              <span className="stat-label">Wins</span>
            </div>
            <div className="profile-stat">
              <span className="stat-value">
                {user.stats.gamesPlayed > 0
                  ? `${Math.round(
                      (user.stats.wins / user.stats.gamesPlayed) * 100
                    )}%`
                  : "0%"}
              </span>
              <span className="stat-label">Win Rate</span>
            </div>
          </div>

          <Button
            onClick={() => navigate("/profile/edit")}
            className="edit-profile-button"
            variant="outline"
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="profile-content-area">
        <div className="profile-tabs">
          <button
            className={`profile-tab ${activeTab === "posts" ? "active" : ""}`}
            onClick={() => setActiveTab("posts")}
          >
            Posts
          </button>
          <button
            className={`profile-tab ${activeTab === "media" ? "active" : ""}`}
            onClick={() => setActiveTab("media")}
          >
            Media
          </button>
          <button
            className={`profile-tab ${
              activeTab === "achievements" ? "active" : ""
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </button>
          <button
            className={`profile-tab ${activeTab === "games" ? "active" : ""}`}
            onClick={() => setActiveTab("games")}
          >
            Games
          </button>
        </div>

        <div className="profile-posts">
          {activeTab === "posts" &&
            posts.map((post) => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="post-avatar">
                    {user.avatar ? (
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.username}
                        onError={(e) => {
                          e.currentTarget.style.display = "none"
                          e.currentTarget.parentElement!.classList.add(
                            "avatar-fallback"
                          )
                          e.currentTarget.parentElement!.textContent =
                            getInitials(user.username)
                        }}
                      />
                    ) : (
                      getInitials(user.username)
                    )}
                  </div>
                  <div className="post-user-info">
                    <div className="post-user-name">{user.username}</div>
                    <div className="post-user-handle">
                      @{user.username.toLowerCase()}
                    </div>
                  </div>
                  <div className="post-time">{formatDate(post.timestamp)}</div>
                </div>

                <div className="post-content">
                  <p>{post.content}</p>
                  {post.image && (
                    <div className="post-image">
                      <img
                        src={post.image || "/placeholder.svg"}
                        alt="Post attachment"
                      />
                    </div>
                  )}
                </div>

                <div className="post-actions">
                  <button className="post-action">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                    <span>{post.comments}</span>
                  </button>

                  <button className="post-action">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 1l4 4-4 4"></path>
                      <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
                      <path d="M7 23l-4-4 4-4"></path>
                      <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
                    </svg>
                    <span>{post.retweets}</span>
                  </button>

                  <button className="post-action">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span>{post.likes}</span>
                  </button>
                </div>
              </div>
            ))}

          {activeTab === "media" && (
            <div className="media-grid">
              {posts
                .filter((post) => post.image)
                .map((post) => (
                  <div key={post.id} className="media-item">
                    <img src={post.image || "/placeholder.svg"} alt="Media" />
                  </div>
                ))}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="achievements-placeholder">
              <h2>Achievements</h2>
              <p>Your game achievements will appear here</p>
            </div>
          )}

          {activeTab === "games" && (
            <div className="games-placeholder">
              <h2>Game History</h2>
              <p>Your recent games will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
