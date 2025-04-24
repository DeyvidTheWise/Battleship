import type React from "react"

import { useState } from "react"
import { Button } from "../../atoms/Button/Button"
import { Input } from "../../atoms/Input/Input"
import { X, Search, UserPlus } from "lucide-react"
import "./FriendInviteModal.css"

interface FriendInviteModalProps {
  isOpen: boolean
  onClose: () => void
  onInvite: (username: string) => void
}

export const FriendInviteModal: React.FC<FriendInviteModalProps> = ({
  isOpen,
  onClose,
  onInvite,
}) => {
  const [username, setUsername] = useState("")
  const [searchResults, setSearchResults] = useState<
    { id: string; username: string; avatar: string }[]
  >([])
  const [isSearching, setIsSearching] = useState(false)

  if (!isOpen) return null

  const handleSearch = () => {
    if (!username.trim()) return

    setIsSearching(true)

    // Mock search results
    setTimeout(() => {
      setSearchResults(
        [
          { id: "101", username: "Player101", avatar: "P1" },
          { id: "102", username: "BattleshipMaster", avatar: "BM" },
          { id: "103", username: "NavalTactician", avatar: "NT" },
        ].filter((user) =>
          user.username.toLowerCase().includes(username.toLowerCase())
        )
      )
      setIsSearching(false)
    }, 500)
  }

  const handleInvite = (username: string) => {
    onInvite(username)
    onClose()
  }

  return (
    <div className="friend-invite-modal-overlay">
      <div className="friend-invite-modal">
        <div className="friend-invite-modal-header">
          <h3>Invite Friend</h3>
          <button className="close-button" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="friend-invite-modal-content">
          <div className="search-container">
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Search by username"
              className="search-input"
            />
            <Button onClick={handleSearch} className="search-button">
              <Search size={18} />
            </Button>
          </div>

          {isSearching ? (
            <div className="searching-message">Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className="search-results">
              {searchResults.map((user) => (
                <div key={user.id} className="user-result">
                  <div className="user-avatar">{user.avatar}</div>
                  <div className="user-info">
                    <div className="user-username">{user.username}</div>
                  </div>
                  <Button
                    onClick={() => handleInvite(user.username)}
                    className="invite-button"
                  >
                    <UserPlus size={16} />
                    Invite
                  </Button>
                </div>
              ))}
            </div>
          ) : username && !isSearching ? (
            <div className="no-results">No users found</div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export default FriendInviteModal
