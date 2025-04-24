"use client"

import type React from "react"
import { Button } from "../../../components/atoms/Button/Button"
import "./GameOverModal.css"

interface GameStats {
  shotsTotal: number
  shotsHit: number
  shotsMissed: number
  shipsDestroyed: number
  timeElapsed: number
}

interface GameOverModalProps {
  isVisible: boolean
  isVictory: boolean
  stats: GameStats
  onPlayAgain: () => void
  onMainMenu: () => void
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isVisible,
  isVictory,
  stats,
  onPlayAgain,
  onMainMenu,
}) => {
  if (!isVisible) return null

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const calculateAccuracy = (): string => {
    if (stats.shotsTotal === 0) return "0%"
    return `${Math.round((stats.shotsHit / stats.shotsTotal) * 100)}%`
  }

  return (
    <div className="game-over-modal-overlay">
      <div className="game-over-modal">
        <div className="modal-content">
          <h2 className={isVictory ? "victory-title" : "defeat-title"}>{isVictory ? "Victory!" : "Defeat!"}</h2>

          <div className="game-stats">
            <div className="stat-item">
              <span className="stat-label">Accuracy</span>
              <span className="stat-value">{calculateAccuracy()}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Shots Fired</span>
              <span className="stat-value">{stats.shotsTotal}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Hits</span>
              <span className="stat-value">{stats.shotsHit}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Misses</span>
              <span className="stat-value">{stats.shotsMissed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Ships Destroyed</span>
              <span className="stat-value">{stats.shipsDestroyed}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time</span>
              <span className="stat-value">{formatTime(stats.timeElapsed)}</span>
            </div>
          </div>

          <div className="modal-actions">
            <Button onClick={onPlayAgain} className="play-again-btn">
              Play Again
            </Button>
            <Button onClick={onMainMenu} className="main-menu-btn">
              Main Menu
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GameOverModal
