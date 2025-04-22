import React, { useState } from "react"
import { ProfilePageTemplate } from "templates"
import styles from "./ProfilePage.module.css"

const ProfilePage: React.FC = () => {
  const [bio, setBio] = useState("I love playing Battleship!")

  const stats = [
    { label: "Games Played", value: 50 },
    { label: "Win Rate", value: "60%" },
    { label: "Elo", value: 1200 },
  ]

  const achievements = [
    {
      label: "First Win",
      description: "Win your first game",
      isUnlocked: true,
    },
    { label: "Strategist", description: "Win 10 games", isUnlocked: false },
    { label: "Admiral", description: "Reach 1500 Elo", isUnlocked: false },
  ]

  const matches = [
    {
      opponent: "Player1",
      outcome: "win" as const,
      onReplay: () => console.log("Replay match vs Player1"),
    },
    {
      opponent: "Player2",
      outcome: "loss" as const,
      onReplay: () => console.log("Replay match vs Player2"),
    },
  ]

  const friends = [
    {
      username: "Friend1",
      isOnline: true,
      onMessage: () => console.log("Message Friend1"),
      onInvite: () => console.log("Invite Friend1"),
      onSpectate: () => console.log("Spectate Friend1"),
    },
    {
      username: "Friend2",
      isOnline: false,
      onMessage: () => console.log("Message Friend2"),
      onInvite: () => console.log("Invite Friend2"),
      onSpectate: () => console.log("Spectate Friend2"),
    },
  ]

  return (
    <div className={styles.profilePage}>
      <ProfilePageTemplate
        avatarSrc="https://via.placeholder.com/100"
        bio={bio}
        stats={stats}
        achievements={achievements}
        matches={matches}
        friends={friends}
        onBioChange={setBio}
      />
    </div>
  )
}

export default ProfilePage
