"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./ChatPage.css"
import { useAuth } from "../../contexts/AuthContext"
import { ArrowLeft } from "lucide-react"

interface Friend {
  id: string
  username: string
  avatar?: string
  status: "online" | "offline" | "in-game"
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount?: number
}

interface ChatMessage {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
  read: boolean
}

const ChatPage: React.FC = () => {
  const { user } = useAuth()
  const [friends, setFriends] = useState<Friend[]>([])
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState("")
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        if (selectedFriend) {
          setShowSidebar(false)
        }
      } else {
        setShowSidebar(true)
      }
    }

    handleResize()

    window.addEventListener("resize", handleResize)

    return () => window.removeEventListener("resize", handleResize)
  }, [selectedFriend])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [selectedFriend, messages])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        setIsLoading(true)

        const mockFriends: Friend[] = [
          {
            id: "1",
            username: "Player1",
            status: "online",
            lastMessage: "Good luck with your next game!",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 5),
            unreadCount: 2,
          },
          {
            id: "2",
            username: "SeaBattleKing",
            status: "in-game",
            lastMessage: "Want to play a game later?",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 30),
          },
          {
            id: "3",
            username: "NavalCommander",
            status: "offline",
            lastMessage: "Thanks for the game yesterday",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
          {
            id: "4",
            username: "ShipDestroyer",
            status: "online",
            lastMessage: "I'll get my revenge next time!",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2),
            unreadCount: 1,
          },
          {
            id: "5",
            username: "AdmiralAwesome",
            status: "online",
            lastMessage: "Check out my new strategy",
            lastMessageTime: new Date(Date.now() - 1000 * 60 * 120),
          },
        ]

        setFriends(mockFriends)

        if (
          mockFriends.length > 0 &&
          !selectedFriend &&
          window.innerWidth > 768
        ) {
          setSelectedFriend(mockFriends[0])
        }

        const mockMessages: Record<string, ChatMessage[]> = {}

        mockFriends.forEach((friend) => {
          mockMessages[friend.id] = [
            {
              id: `${friend.id}-1`,
              senderId: friend.id,
              receiverId: "current-user",
              content: "Hey there!",
              timestamp: new Date(Date.now() - 1000 * 60 * 60),
              read: true,
            },
            {
              id: `${friend.id}-2`,
              senderId: "current-user",
              receiverId: friend.id,
              content: "Hi! How are you?",
              timestamp: new Date(Date.now() - 1000 * 60 * 55),
              read: true,
            },
            {
              id: `${friend.id}-3`,
              senderId: friend.id,
              receiverId: "current-user",
              content: friend.lastMessage || "What's up?",
              timestamp:
                friend.lastMessageTime || new Date(Date.now() - 1000 * 60 * 50),
              read: !friend.unreadCount,
            },
          ]
        })

        setMessages(mockMessages)
      } catch (error) {
        console.error("Error fetching friends:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFriends()
  }, [])

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedFriend) return

    const newMsg: ChatMessage = {
      id: `new-${Date.now()}`,
      senderId: "current-user",
      receiverId: selectedFriend.id,
      content: newMessage,
      timestamp: new Date(),
      read: false,
    }

    setMessages((prev) => ({
      ...prev,
      [selectedFriend.id]: [...(prev[selectedFriend.id] || []), newMsg],
    }))

    setFriends((prev) =>
      prev.map((friend) =>
        friend.id === selectedFriend.id
          ? {
              ...friend,
              lastMessage: newMessage,
              lastMessageTime: new Date(),
            }
          : friend
      )
    )

    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSelectFriend = (friend: Friend) => {
    setSelectedFriend(friend)

    if (window.innerWidth <= 768) {
      setShowSidebar(false)
    }

    if (friend.unreadCount) {
      setFriends((prev) =>
        prev.map((f) => (f.id === friend.id ? { ...f, unreadCount: 0 } : f))
      )

      if (messages[friend.id]) {
        setMessages((prev) => ({
          ...prev,
          [friend.id]: prev[friend.id].map((msg) => ({
            ...msg,
            read: true,
          })),
        }))
      }
    }
  }

  const formatTime = (date?: Date) => {
    if (!date) return ""

    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 24 * 60 * 60 * 1000) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    if (diff < 7 * 24 * 60 * 60 * 1000) {
      return date.toLocaleDateString([], { weekday: "short" })
    }

    return date.toLocaleDateString([], { month: "short", day: "numeric" })
  }

  const getInitials = (name: string) => {
    if (!name) return ""
    const words = name.split(/\s+/)
    if (words.length === 1) {
      return name.substring(0, 2).toUpperCase()
    }
    return (words[0][0] + words[1][0]).toUpperCase()
  }

  return (
    <div
      className={`chat-page-container ${showSidebar ? "sidebar-active" : ""}`}
    >
      <div className="chat-container">
        <div className={`chat-sidebar ${showSidebar ? "active" : ""}`}>
          <div className="chat-sidebar-header">
            <h2>Chats</h2>
          </div>

          <div className="chat-rooms">
            {isLoading ? (
              <div className="chat-loading">Loading chats...</div>
            ) : friends.length === 0 ? (
              <div className="no-chats">No chats available</div>
            ) : (
              friends.map((friend) => (
                <div
                  key={friend.id}
                  className={`chat-room ${
                    selectedFriend?.id === friend.id ? "active" : ""
                  }`}
                  onClick={() => handleSelectFriend(friend)}
                >
                  <div className="chat-room-avatar">
                    {getInitials(friend.username)}
                    <span
                      className={`status-indicator status-${friend.status}`}
                    ></span>
                  </div>

                  <div className="chat-room-info">
                    <div className="chat-room-name-row">
                      <span className="chat-room-name">{friend.username}</span>
                      <span className="chat-room-time">
                        {formatTime(friend.lastMessageTime)}
                      </span>
                    </div>

                    <div className="chat-room-message-row">
                      <span className="chat-room-last-message">
                        {friend.lastMessage || "No messages yet"}
                      </span>

                      {friend.unreadCount ? (
                        <span className="chat-room-unread">
                          {friend.unreadCount}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="chat-main">
          {selectedFriend ? (
            <>
              <div className="chat-header">
                <button
                  className="chat-back-button md:hidden"
                  onClick={() => setShowSidebar(true)}
                  aria-label="Back to chat list"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="chat-header-avatar">
                  {getInitials(selectedFriend.username)}
                  <span
                    className={`status-indicator status-${selectedFriend.status}`}
                  ></span>
                </div>

                <div className="chat-header-info">
                  <div className="chat-header-name">
                    {selectedFriend.username}
                  </div>
                  <div className="chat-header-status">
                    {selectedFriend.status}
                  </div>
                </div>
              </div>

              <div className="chat-messages">
                {messages[selectedFriend.id]?.length === 0 ? (
                  <div className="no-messages">
                    No messages yet. Start the conversation!
                  </div>
                ) : (
                  messages[selectedFriend.id]?.map((message) => (
                    <div
                      key={message.id}
                      className={`chat-message ${
                        message.senderId === "current-user" ? "sent" : ""
                      }`}
                    >
                      <div className="chat-message-avatar">
                        {message.senderId === "current-user"
                          ? getInitials(user?.username || "You")
                          : getInitials(selectedFriend.username)}
                      </div>
                      <div className="chat-message-content">
                        <div className="chat-message-text">
                          {message.content}
                        </div>
                        <div className="chat-message-time">
                          {formatTime(message.timestamp)}
                          {message.senderId === "current-user" && (
                            <span className="message-status">
                              {message.read ? " ✓✓" : " ✓"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message..."
                  className="chat-input-field"
                />
                <button onClick={handleSendMessage} className="chat-input-send">
                  Send
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="no-chat-icon">💬</div>
              <h3>Select a chat to start messaging</h3>
              <p>
                Choose a friend from the list to start or continue a
                conversation
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatPage
