"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "../../../components/atoms/Button/Button"
import { Input } from "../../../components/atoms/Input/Input"
import "./MultiplayerLobby.css"

interface GameRoom {
  id: string
  name: string
  host: string
  players: number
  maxPlayers: number
  status: "waiting" | "in-progress" | "full"
}

interface MultiplayerLobbyProps {
  username: string
  onCreateRoom: (roomName: string) => void
  onJoinRoom: (roomId: string) => void
  onRefreshRooms: () => void
}

export const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  username,
  onCreateRoom,
  onJoinRoom,
  onRefreshRooms,
}) => {
  const [rooms, setRooms] = useState<GameRoom[]>([])
  const [newRoomName, setNewRoomName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)

  
  useEffect(() => {
    const mockRooms: GameRoom[] = [
      { id: "1", name: "Battleship Masters", host: "Player1", players: 1, maxPlayers: 2, status: "waiting" },
      { id: "2", name: "Naval Warfare", host: "Player2", players: 2, maxPlayers: 2, status: "full" },
      { id: "3", name: "Sea Battle", host: "Player3", players: 1, maxPlayers: 2, status: "waiting" },
      { id: "4", name: "Ship Hunters", host: "Player4", players: 1, maxPlayers: 2, status: "in-progress" },
    ]

    setRooms(mockRooms)
  }, [])

  const handleCreateRoom = () => {
    if (!newRoomName.trim()) return

    onCreateRoom(newRoomName)
    setNewRoomName("")
    setIsCreatingRoom(false)
  }

  const handleRefresh = () => {
    onRefreshRooms()
  }

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      room.host.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusClass = (status: GameRoom["status"]) => {
    switch (status) {
      case "waiting":
        return "status-waiting"
      case "in-progress":
        return "status-in-progress"
      case "full":
        return "status-full"
      default:
        return ""
    }
  }

  return (
    <div className="multiplayer-lobby">
      <div className="lobby-header">
        <h2>Multiplayer Lobby</h2>
        <div className="lobby-actions">
          <Button onClick={() => setIsCreatingRoom(true)} className="create-room-btn">
            Create Room
          </Button>
          <Button onClick={handleRefresh} className="refresh-btn">
            Refresh
          </Button>
        </div>
      </div>

      <div className="search-container">
        <Input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search rooms..."
        />
      </div>

      {isCreatingRoom && (
        <div className="create-room-form">
          <Input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Room name"
          />
          <div className="form-actions">
            <Button onClick={handleCreateRoom} className="confirm-btn">
              Create
            </Button>
            <Button onClick={() => setIsCreatingRoom(false)} className="cancel-btn">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="rooms-list">
        {filteredRooms.length === 0 ? (
          <div className="no-rooms">No rooms found</div>
        ) : (
          filteredRooms.map((room) => (
            <div key={room.id} className="room-item">
              <div className="room-info">
                <div className="room-name">{room.name}</div>
                <div className="room-host">Host: {room.host}</div>
                <div className="room-players">
                  Players: {room.players}/{room.maxPlayers}
                </div>
                <div className={`room-status ${getStatusClass(room.status)}`}>{room.status}</div>
              </div>
              <div className="room-actions">
                <Button onClick={() => onJoinRoom(room.id)} disabled={room.status !== "waiting"} className="join-btn">
                  Join
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MultiplayerLobby
