// client/src/components/pages/Profile.tsx
import React, { useEffect, useState } from "react"
import { Text, Button } from "../atoms"
import { Chat } from "../molecules"
import { PageLayout } from "../organisms"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"

interface UserProfile {
  id: string
  firstname: string
  lastname: string
  email: string
  xp: number
  bio?: string
}

interface GameHistoryEntry {
  id: string
  user_id: string
  opponent_id: string
  firstname?: string
  lastname?: string
  result: "win" | "loss" | "draw"
  xp_earned: number
  played_at: string
}

interface Friend {
  id: string
  firstname: string
  lastname: string
}

const Profile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [history, setHistory] = useState<GameHistoryEntry[]>([])
  const [friends, setFriends] = useState<Friend[]>([])
  const [friendRequests, setFriendRequests] = useState<Friend[]>([])
  const [selectedFriendId, setSelectedFriendId] = useState<string | null>(null)
  const [bio, setBio] = useState<string>("")
  const [isEditingBio, setIsEditingBio] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}`
        )
        if (!response.ok) throw new Error("Failed to fetch profile")
        const data = await response.json()
        setProfile(data)
        setBio(data.bio || "")
      } catch (err) {
        console.error(err)
      }
    }

    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/profile/${userId}/history`
        )
        if (!response.ok) throw new Error("Failed to fetch game history")
        const data = await response.json()
        setHistory(data)
      } catch (err) {
        console.error(err)
      }
    }

    const fetchFriends = async () => {
      if (user?.id === userId) {
        try {
          const response = await fetch("http://localhost:5000/api/friends", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          })
          if (!response.ok) throw new Error("Failed to fetch friends")
          const data = await response.json()
          setFriends(data)
        } catch (err) {
          console.error(err)
        }
      }
    }

    const fetchFriendRequests = async () => {
      if (user?.id === userId) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/friends/requests",
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          )
          if (!response.ok) throw new Error("Failed to fetch friend requests")
          const data = await response.json()
          setFriendRequests(data)
        } catch (err) {
          console.error(err)
        }
      }
    }

    fetchProfile()
    fetchHistory()
    fetchFriends()
    fetchFriendRequests()
  }, [userId, user])

  const handleBioSubmit = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/profile/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ bio }),
        }
      )
      if (!response.ok) throw new Error("Failed to update bio")
      setProfile((prev) => (prev ? { ...prev, bio } : prev))
      setIsEditingBio(false)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSendFriendRequest = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/friends/request",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ friendId: userId }),
        }
      )
      if (!response.ok) throw new Error("Failed to send friend request")
      alert("Friend request sent!")
    } catch (err) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  const handleAcceptFriendRequest = async (friendId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/friends/accept", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ friendId }),
      })
      if (!response.ok) throw new Error("Failed to accept friend request")
      setFriendRequests((prev) => prev.filter((req) => req.id !== friendId))
      setFriends((prev) => [
        ...prev,
        friendRequests.find((req) => req.id === friendId)!,
      ])
    } catch (err) {
      console.error(err)
      alert((err as Error).message)
    }
  }

  if (!profile)
    return (
      <Text style={{ textAlign: "center", marginTop: "5rem" }}>Loading...</Text>
    )

  return (
    <PageLayout>
      <Text
        variant="h1"
        style={{ textAlign: "center", marginBottom: "1.5rem", color: "#fff" }}
      >
        Profile
      </Text>
      <div className="glass-container" style={{ marginBottom: "2rem" }}>
        <Text variant="h2">{`${profile.firstname} ${profile.lastname}`}</Text>
        <Text>Email: {profile.email}</Text>
        <Text>XP: {profile.xp}</Text>
        <Text style={{ marginTop: "1rem" }}>
          Bio:{" "}
          {isEditingBio ? (
            <>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginTop: "0.5rem",
                }}
                rows={3}
              />
              <div
                style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
              >
                <Button onClick={handleBioSubmit}>Save</Button>
                <Button onClick={() => setIsEditingBio(false)} variant="danger">
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {profile.bio || "No bio set"}
              {user?.id === userId && (
                <Button
                  onClick={() => setIsEditingBio(true)}
                  variant="secondary"
                  style={{ marginLeft: "1rem" }}
                >
                  Edit Bio
                </Button>
              )}
            </>
          )}
        </Text>
        {user?.id !== userId && (
          <Button
            onClick={handleSendFriendRequest}
            variant="primary"
            style={{ marginTop: "1rem" }}
          >
            Send Friend Request
          </Button>
        )}
      </div>

      {user?.id === userId && (
        <>
          <Text
            variant="h2"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            Friend Requests
          </Text>
          {friendRequests.length > 0 ? (
            <div className="glass-container" style={{ marginBottom: "2rem" }}>
              {friendRequests.map((request) => (
                <div
                  key={request.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text>{`${request.firstname} ${request.lastname}`}</Text>
                  <Button
                    onClick={() => handleAcceptFriendRequest(request.id)}
                    variant="primary"
                  >
                    Accept
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Text style={{ textAlign: "center", marginBottom: "2rem" }}>
              No pending friend requests.
            </Text>
          )}

          <Text
            variant="h2"
            style={{ textAlign: "center", marginBottom: "1rem" }}
          >
            Friends
          </Text>
          {friends.length > 0 ? (
            <div className="glass-container" style={{ marginBottom: "2rem" }}>
              {friends.map((friend) => (
                <div
                  key={friend.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  <Text>{`${friend.firstname} ${friend.lastname}`}</Text>
                  <Button
                    onClick={() => setSelectedFriendId(friend.id)}
                    variant="primary"
                  >
                    Chat
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <Text style={{ textAlign: "center", marginBottom: "2rem" }}>
              No friends yet.
            </Text>
          )}

          {selectedFriendId && (
            <>
              <Text
                variant="h2"
                style={{ textAlign: "center", marginBottom: "1rem" }}
              >
                Chat with{" "}
                {friends.find((f) => f.id === selectedFriendId)?.firstname}
              </Text>
              <Chat friendId={selectedFriendId} />
              <Button
                onClick={() => setSelectedFriendId(null)}
                variant="danger"
                style={{ display: "block", margin: "1rem auto" }}
              >
                Close Chat
              </Button>
            </>
          )}
        </>
      )}

      <Text variant="h2" style={{ textAlign: "center", marginBottom: "1rem" }}>
        Game History
      </Text>
      {history.length > 0 ? (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Opponent</th>
              <th>Result</th>
              <th>XP Earned</th>
            </tr>
          </thead>
          <tbody>
            {history.map((entry) => (
              <tr key={entry.id}>
                <td>{new Date(entry.played_at).toLocaleString()}</td>
                <td>
                  {entry.opponent_id === "AI"
                    ? "AI"
                    : `${entry.firstname} ${entry.lastname}`}
                </td>
                <td>
                  {entry.result.charAt(0).toUpperCase() + entry.result.slice(1)}
                </td>
                <td>{entry.xp_earned}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <Text style={{ textAlign: "center" }}>No game history available.</Text>
      )}
    </PageLayout>
  )
}

export default Profile
