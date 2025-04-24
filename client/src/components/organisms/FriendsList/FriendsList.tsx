"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../../../components/atoms/Button/Button"
import { Input } from "../../../components/atoms/Input/Input"
import "./FriendsList.css"

interface Friend {
  id: string
  username: string
  status: "online" | "offline" | "in-game"
  lastSeen?: Date
}

interface FriendsListProps {
  friends?: Friend[]
  onInviteFriend?: (friendId: string) => void
  onMessageFriend?: (friendId: string) => void
  onAddFriend?: (username: string) => void
}

export const FriendsList: React.FC<FriendsListProps> = ({
  friends = [],
  onInviteFriend,
  onMessageFriend,
  onAddFriend,
}) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [newFriendUsername, setNewFriendUsername] = useState("")

  const filteredFriends = friends.filter((friend) => friend.username.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleAddFriend = () => {
    if (!newFriendUsername.trim()) return

    if (onAddFriend) {
      onAddFriend(newFriendUsername)
    }

    setNewFriendUsername("")
  }

  const getStatusClass = (status: Friend["status"]) => {
    switch (status) {
      case "online":
        return "status-online"
      case "offline":
        return "status-offline"
      case "in-game":
        return "status-in-game"
      default:
        return ""
    }
  }

  return (
    <div className="friends-list">
      <div className="friends-header">
        <h3>Friends</h3>
        <div className="search-bar">
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search friends..."
          />
        </div>
      </div>

      <div className="add-friend">
        <Input
          type="text"
          value={newFriendUsername}
          onChange={(e) => setNewFriendUsername(e.target.value)}
          placeholder="Add friend by username"
        />
        <Button onClick={handleAddFriend}>Add</Button>
      </div>

      <div className="friends-container">
        {filteredFriends.length === 0 ? (
          <div className="no-friends">No friends found</div>
        ) : (
          filteredFriends.map((friend) => (
            <div key={friend.id} className="friend-item">
              <div className="friend-info">
                <div className={`status-indicator ${getStatusClass(friend.status)}`} />
                <div className="username">{friend.username}</div>
                <div className="status-text">{friend.status}</div>
              </div>
              <div className="friend-actions">
                {friend.status !== "offline" && onInviteFriend && (
                  <Button onClick={() => onInviteFriend(friend.id)}>Invite</Button>
                )}
                {onMessageFriend && <Button onClick={() => onMessageFriend(friend.id)}>Message</Button>}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FriendsList
