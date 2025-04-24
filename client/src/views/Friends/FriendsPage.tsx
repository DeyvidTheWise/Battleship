"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { Button } from "../../components/atoms/Button/Button"
import { Input } from "../../components/atoms/Input/Input"
import { apiClient } from "../../utils/ApiClient"
import { useAuth } from "../../contexts/AuthContext"
import { useToast } from "../../contexts/ToastContext"
import "./FriendsPage.css"

interface Friend {
  id: number
  username: string
  avatar?: string
  status: "online" | "offline" | "in-game"
  lastActive?: string
}

interface FriendRequest {
  id: number
  username: string
  avatar?: string
  createdAt: string
}

interface FriendsResponse {
  friends: Friend[]
}

interface FriendRequestsResponse {
  requests: FriendRequest[]
}

const FriendsPage: React.FC = () => {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([])
  const [activeTab, setActiveTab] = useState<"all" | "online" | "requests">(
    "all"
  )
  const [searchTerm, setSearchTerm] = useState("")
  const [newFriendUsername, setNewFriendUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [shouldRefresh, setShouldRefresh] = useState(0)

  const fetchFriends = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.get<FriendsResponse>(
        "/api/social/friends"
      )
      setFriends(response.friends || [])

      const requestsResponse = await apiClient.get<FriendRequestsResponse>(
        "/api/social/friends/requests"
      )
      setFriendRequests(requestsResponse.requests || [])
    } catch (error) {
      console.error("Error fetching friends:", error)
      showToast({
        title: "Error",
        description: "Failed to load friends",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [showToast])

  useEffect(() => {
    fetchFriends()
  }, [shouldRefresh])

  const handleAddFriend = async () => {
    if (!newFriendUsername.trim()) return

    try {
      await apiClient.post("/api/social/friends/request", {
        username: newFriendUsername,
      })
      showToast({
        title: "Success",
        description: `Friend request sent to ${newFriendUsername}`,
        variant: "success",
      })
      setNewFriendUsername("")
      setShouldRefresh((prev) => prev + 1)
    } catch (error) {
      console.error("Error sending friend request:", error)
      showToast({
        title: "Error",
        description: "Failed to send friend request",
        variant: "destructive",
      })
    }
  }

  const handleAcceptRequest = async (requestId: number) => {
    try {
      await apiClient.post(`/api/social/friends/requests/${requestId}/accept`)

      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      )

      setShouldRefresh((prev) => prev + 1)

      showToast({
        title: "Success",
        description: "Friend request accepted",
        variant: "success",
      })
    } catch (error) {
      console.error("Error accepting friend request:", error)
      showToast({
        title: "Error",
        description: "Failed to accept friend request",
        variant: "destructive",
      })
    }
  }

  const handleRejectRequest = async (requestId: number) => {
    try {
      await apiClient.post(`/api/social/friends/requests/${requestId}/reject`)

      setFriendRequests((prev) =>
        prev.filter((request) => request.id !== requestId)
      )

      showToast({
        title: "Success",
        description: "Friend request rejected",
        variant: "success",
      })
    } catch (error) {
      console.error("Error rejecting friend request:", error)
      showToast({
        title: "Error",
        description: "Failed to reject friend request",
        variant: "destructive",
      })
    }
  }

  const handleMessageFriend = (friendId: number) => {
    window.location.href = `/chat?friend=${friendId}`
  }

  const handleInviteToGame = (friendId: number) => {
    showToast({
      title: "Invite Sent",
      description: "Game invitation has been sent",
      variant: "success",
    })
  }

  const filteredFriends = friends.filter((friend) => {
    if (activeTab === "online" && friend.status !== "online") return false
    return friend.username.toLowerCase().includes(searchTerm.toLowerCase())
  })

  useEffect(() => {
    if (friends.length === 0 && !isLoading) {
      const mockFriends: Friend[] = [
        { id: 1, username: "Player1", status: "online", avatar: "P1" },
        { id: 2, username: "Player2", status: "offline", avatar: "P2" },
        { id: 3, username: "Player3", status: "in-game", avatar: "P3" },
        { id: 4, username: "Admiral_Awesome", status: "online", avatar: "AA" },
        { id: 5, username: "SeaBattleKing", status: "in-game", avatar: "SB" },
      ]
      setFriends(mockFriends)
    }

    if (friendRequests.length === 0 && !isLoading) {
      const mockRequests: FriendRequest[] = [
        {
          id: 6,
          username: "NavalCommander",
          avatar: "NC",
          createdAt: new Date().toISOString(),
        },
        {
          id: 7,
          username: "ShipDestroyer",
          avatar: "SD",
          createdAt: new Date().toISOString(),
        },
      ]
      setFriendRequests(mockRequests)
    }
  }, [friends.length, friendRequests.length, isLoading])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Friends</h1>
        <div className="relative w-64">
          <Input
            type="text"
            placeholder="Search friends..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-[#1A2A44] border-[#4A4A4A] text-white pl-10"
          />
          <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <div className="bg-[#2D3748] rounded-lg p-4 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-[#4ECDC4]">
              Add Friend
            </h2>
            <div className="flex flex-col space-y-3">
              <Input
                type="text"
                placeholder="Enter username"
                value={newFriendUsername}
                onChange={(e) => setNewFriendUsername(e.target.value)}
                className="bg-[#1A2A44] border-[#4A4A4A] text-white"
              />
              <Button
                onClick={handleAddFriend}
                disabled={!newFriendUsername.trim()}
                className="w-full bg-[#4ECDC4] hover:bg-[#3DBDB5] text-[#1A2A44] font-semibold"
              >
                Add
              </Button>
            </div>
            <p className="text-sm text-[#A3BFFA] mt-2">
              Send a friend request to another player
            </p>
          </div>

          <div className="bg-[#2D3748] rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-4 text-[#4ECDC4]">
              All Friends
            </h2>
            <div className="flex flex-col space-y-1">
              <button
                className={`text-left px-3 py-2 rounded ${
                  activeTab === "all"
                    ? "bg-[#1A2A44] text-[#4ECDC4]"
                    : "text-white hover:bg-[#1A2A44]"
                }`}
                onClick={() => setActiveTab("all")}
              >
                All Friends
              </button>
              <button
                className={`text-left px-3 py-2 rounded ${
                  activeTab === "online"
                    ? "bg-[#1A2A44] text-[#4ECDC4]"
                    : "text-white hover:bg-[#1A2A44]"
                }`}
                onClick={() => setActiveTab("online")}
              >
                Online
              </button>
              <button
                className={`text-left px-3 py-2 rounded flex justify-between items-center ${
                  activeTab === "requests"
                    ? "bg-[#1A2A44] text-[#4ECDC4]"
                    : "text-white hover:bg-[#1A2A44]"
                }`}
                onClick={() => setActiveTab("requests")}
              >
                <span>Requests</span>
                {friendRequests.length > 0 && (
                  <span className="bg-[#FF6B6B] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {friendRequests.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="bg-[#2D3748] rounded-lg p-6">
            {activeTab !== "requests" ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#4ECDC4]">
                    {activeTab === "all" ? "All Friends" : "Online Friends"}
                  </h2>
                  <span className="text-[#A3BFFA]">
                    {filteredFriends.length}
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ECDC4]"></div>
                  </div>
                ) : filteredFriends.length === 0 ? (
                  <div className="text-center py-10 text-[#A3BFFA]">
                    <p className="text-lg">No friends found</p>
                    {searchTerm && (
                      <p className="text-sm mt-2">
                        Try a different search term
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredFriends.map((friend) => (
                      <div
                        key={friend.id}
                        className="bg-[#1A2A44] rounded-lg p-4 flex items-center"
                      >
                        <div className="relative mr-4">
                          <div className="w-12 h-12 rounded-full bg-[#4ECDC4] flex items-center justify-center text-[#1A2A44] font-bold">
                            {friend.avatar ||
                              friend.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div
                            className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1A2A44] ${
                              friend.status === "online"
                                ? "bg-[#4ECDC4]"
                                : friend.status === "in-game"
                                ? "bg-[#FF6B6B]"
                                : "bg-[#A3BFFA]"
                            }`}
                          ></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white truncate">
                            {friend.username}
                          </h3>
                          <p className="text-sm text-[#A3BFFA]">
                            {friend.status}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="p-2 rounded-full bg-[#2D3748] text-[#A3BFFA] hover:bg-[#4ECDC4] hover:text-[#1A2A44]"
                            onClick={() => handleMessageFriend(friend.id)}
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                              />
                            </svg>
                          </button>
                          {friend.status !== "offline" && (
                            <button
                              className="p-2 rounded-full bg-[#2D3748] text-[#A3BFFA] hover:bg-[#4ECDC4] hover:text-[#1A2A44]"
                              onClick={() => handleInviteToGame(friend.id)}
                            >
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-[#4ECDC4]">
                    Friend Requests
                  </h2>
                  <span className="text-[#A3BFFA]">
                    {friendRequests.length}
                  </span>
                </div>

                {isLoading ? (
                  <div className="flex justify-center items-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4ECDC4]"></div>
                  </div>
                ) : friendRequests.length === 0 ? (
                  <div className="text-center py-10 text-[#A3BFFA]">
                    <p className="text-lg">No pending friend requests</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friendRequests.map((request) => (
                      <div
                        key={request.id}
                        className="bg-[#1A2A44] rounded-lg p-4"
                      >
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#4ECDC4] flex items-center justify-center text-[#1A2A44] font-bold mr-4">
                            {request.avatar ||
                              request.username.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">
                              {request.username}
                            </h3>
                            <p className="text-sm text-[#A3BFFA]">
                              Wants to be your friend
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex-1 bg-[#4ECDC4] hover:bg-[#3DBDB5] text-[#1A2A44] font-semibold"
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request.id)}
                            variant="outline"
                            className="flex-1 border-[#FF6B6B] text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                          >
                            Decline
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FriendsPage
