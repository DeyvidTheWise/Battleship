"use client"

import type React from "react"
import { Volume2, VolumeX, Settings } from "lucide-react"
import "./GameHeader.css"

interface Player {
  id: string
  username: string
  score: number
}

interface GameHeaderProps {
  player: Player
  opponent: Player
  timer?: number
  currentTurn?: "player" | "opponent"
  soundEnabled?: boolean
  onToggleSound?: () => void
  onOpenSettings?: () => void
  gamePhase?: "setup" | "playing" | "ended"
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  player,
  opponent,
  timer,
  currentTurn,
  soundEnabled = true,
  onToggleSound,
  onOpenSettings,
  gamePhase = "playing",
}) => {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`
  }

  const getPhaseLabel = (phase: string): string => {
    switch (phase) {
      case "setup":
        return "Setup Phase"
      case "playing":
        return "Battle Phase"
      case "ended":
        return "Game Over"
      default:
        return phase
    }
  }

  return (
    <div className="game-header-wrapper">

      <div className="game-header-container">
        <div className="game-header">
          {gamePhase === "setup" ? (
            
            <div className="setup-phase">
              <div className="setup-phase-text">Setup</div>
            </div>
          ) : (
            
            <div className="player-section">
              <div className="player">
                <div className="phase-indicator">{getPhaseLabel(gamePhase)}</div>
                <div className={`username ${currentTurn === "player" && gamePhase !== "ended" ? "active" : ""}`}>
                  {player.username}
                </div>
                <div className="score">Score: {player.score}</div>
                {currentTurn === "player" && gamePhase !== "ended" && <div className="turn-indicator">Your Turn</div>}
              </div>

              <div className="vs">VS</div>

              <div className="opponent">
                <div className="username">{opponent.username}</div>
                <div className="score">Score: {opponent.score}</div>
                {currentTurn === "opponent" && gamePhase !== "ended" && (
                  <div className="turn-indicator">Opponent's Turn</div>
                )}
              </div>
            </div>
          )}

          {timer !== undefined && gamePhase !== "ended" && (
            <div className="timer-container">
              <div className={`timer ${timer < 10 ? "warning" : ""}`}>Time: {formatTime(timer)}</div>
            </div>
          )}
        </div>

        <div className="settings-container">
          <div className="settings-buttons">
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className="sound-button"
                aria-label={soundEnabled ? "Mute sound" : "Enable sound"}
              >
                {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
              </button>
            )}

            {onOpenSettings && (
              <button onClick={onOpenSettings} className="settings-button" aria-label="Open settings">
                <Settings size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameHeader
