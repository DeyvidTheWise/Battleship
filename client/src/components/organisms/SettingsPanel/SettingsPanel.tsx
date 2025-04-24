"use client"

import type React from "react"
import { useState } from "react"
import { playSound } from "../../../utils/SoundEffects"
import "./SettingsPanel.css"

interface Settings {
  soundEnabled: boolean
  musicEnabled: boolean
  soundVolume: number
  musicVolume: number
  notifications: boolean
  darkMode: boolean
  highContrast: boolean
  autoRotate: boolean
}

interface SettingsPanelProps {
  isVisible: boolean
  initialSettings: Settings
  onClose: () => void
  onSave: (settings: Settings) => void
  soundEnabled?: boolean
  setSoundEnabled?: (enabled: boolean) => void
  soundVolume?: number
  setSoundVolume?: (volume: number) => void
  aiDifficulty?: "easy" | "medium" | "hard"
  setAiDifficulty?: (difficulty: "easy" | "medium" | "hard") => void
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  isVisible,
  initialSettings,
  onClose,
  onSave,
  soundEnabled,
  setSoundEnabled,
  soundVolume,
  setSoundVolume,
  aiDifficulty,
  setAiDifficulty,
}) => {
  const [settings, setSettings] = useState<Settings>(initialSettings)

  if (!isVisible) return null

  const handleChange = (key: keyof Settings, value: boolean | number) => {
    setSettings({
      ...settings,
      [key]: value,
    })

    // If we have direct setters, use them too
    if (key === "soundEnabled" && setSoundEnabled) {
      setSoundEnabled(value as boolean)
    }
    if (key === "soundVolume" && setSoundVolume) {
      setSoundVolume(value as number)
    }

    // Play sound effect for feedback
    if (key !== "soundEnabled" || value) {
      playSound("click", settings.soundVolume, settings.soundEnabled)
    }
  }

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const handleCancel = () => {
    setSettings(initialSettings)
    onClose()
  }

  return (
    <div className="settings-panel">
      <div className="settings-content">
        <h2>Settings</h2>

        <div className="settings-section">
          <h3>Audio</h3>
          <div className="setting-item">
            <label>Sound Effects</label>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => handleChange("soundEnabled", e.target.checked)}
              />
              <span className="switch-slider"></span>
            </div>
          </div>
          {settings.soundEnabled && (
            <div className="setting-item">
              <label>Sound Volume</label>
              <div className="slider">
                <div className="slider-track" style={{ width: `${settings.soundVolume}%` }}></div>
                <div className="slider-thumb" style={{ left: `${settings.soundVolume}%` }}></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.soundVolume}
                  onChange={(e) => handleChange("soundVolume", Number.parseInt(e.target.value))}
                  style={{ opacity: 0, width: "100%", height: "100%", position: "absolute", cursor: "pointer" }}
                />
              </div>
            </div>
          )}
          <div className="setting-item">
            <label>Music</label>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.musicEnabled}
                onChange={(e) => handleChange("musicEnabled", e.target.checked)}
              />
              <span className="switch-slider"></span>
            </div>
          </div>
          {settings.musicEnabled && (
            <div className="setting-item">
              <label>Music Volume</label>
              <div className="slider">
                <div className="slider-track" style={{ width: `${settings.musicVolume}%` }}></div>
                <div className="slider-thumb" style={{ left: `${settings.musicVolume}%` }}></div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={settings.musicVolume}
                  onChange={(e) => handleChange("musicVolume", Number.parseInt(e.target.value))}
                  style={{ opacity: 0, width: "100%", height: "100%", position: "absolute", cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="settings-section">
          <h3>Interface</h3>
          <div className="setting-item">
            <label>Notifications</label>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.notifications}
                onChange={(e) => handleChange("notifications", e.target.checked)}
              />
              <span className="switch-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>Dark Mode</label>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.darkMode}
                onChange={(e) => handleChange("darkMode", e.target.checked)}
              />
              <span className="switch-slider"></span>
            </div>
          </div>
          <div className="setting-item">
            <label>High Contrast</label>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.highContrast}
                onChange={(e) => handleChange("highContrast", e.target.checked)}
              />
              <span className="switch-slider"></span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Gameplay</h3>
          <div className="setting-item">
            <label>Auto-Rotate Ships</label>
            <div className="switch">
              <input
                type="checkbox"
                checked={settings.autoRotate}
                onChange={(e) => handleChange("autoRotate", e.target.checked)}
              />
              <span className="switch-slider"></span>
            </div>
          </div>

          {aiDifficulty && setAiDifficulty && (
            <div className="setting-item">
              <label>AI Difficulty</label>
              <div className="difficulty-buttons">
                <button data-active={aiDifficulty === "easy"} onClick={() => setAiDifficulty("easy")}>
                  Easy
                </button>
                <button data-active={aiDifficulty === "medium"} onClick={() => setAiDifficulty("medium")}>
                  Medium
                </button>
                <button data-active={aiDifficulty === "hard"} onClick={() => setAiDifficulty("hard")}>
                  Hard
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="settings-actions">
          <button className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
