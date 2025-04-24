"use client"

import React from "react"


export const playSound = (
  soundName: "hit" | "miss" | "sunk" | "place" | "rotate" | "click" | "victory" | "defeat" | "timer-warning",
  volume = 0.5,
  enabled = true,
): void => {
  
  if (typeof window === "undefined" || !enabled) return

  try {
    const audio = new Audio(`/sounds/${soundName}.mp3`)
    audio.volume = volume

    
    const playPromise = audio.play()

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        console.warn(`Sound play failed: ${error}`)
      })
    }
  } catch (error) {
    console.error(`Error playing sound ${soundName}:`, error)
  }
}


export const preloadSounds = (): void => {
  if (typeof window === "undefined") return

  const sounds = ["hit", "miss", "sunk", "place", "rotate", "click", "victory", "defeat", "timer-warning"]

  sounds.forEach((sound) => {
    const audio = new Audio(`/sounds/${sound}.mp3`)
    audio.preload = "auto"
  })
}


export const useSoundSettings = () => {
  const [soundEnabled, setSoundEnabled] = React.useState(true)
  const [soundVolume, setSoundVolume] = React.useState(0.5)

  
  React.useEffect(() => {
    const storedSoundEnabled = localStorage.getItem("soundEnabled")
    const storedSoundVolume = localStorage.getItem("soundVolume")

    if (storedSoundEnabled !== null) {
      setSoundEnabled(storedSoundEnabled === "true")
    }

    if (storedSoundVolume !== null) {
      setSoundVolume(Number.parseFloat(storedSoundVolume))
    }
  }, [])

  
  React.useEffect(() => {
    localStorage.setItem("soundEnabled", String(soundEnabled))
    localStorage.setItem("soundVolume", String(soundVolume))
  }, [soundEnabled, soundVolume])

  return {
    soundEnabled,
    setSoundEnabled,
    soundVolume,
    setSoundVolume,
  }
}
