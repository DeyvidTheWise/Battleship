import React from "react"
import { ProfileHeader } from "molecules"
import {
  StatsSection,
  AchievementsGrid,
  MatchHistoryList,
  FriendsList,
} from "organisms"
import styles from "./ProfilePageTemplate.module.css"

interface ProfilePageTemplateProps {
  avatarSrc?: string
  bio: string
  stats: { label: string; value: string | number }[]
  achievements: { label: string; description: string; isUnlocked: boolean }[]
  matches: { opponent: string; outcome: "win" | "loss"; onReplay: () => void }[]
  friends: {
    username: string
    isOnline: boolean
    onMessage: () => void
    onInvite: () => void
    onSpectate: () => void
  }[]
  onBioChange: (bio: string) => void
}

const ProfilePageTemplate: React.FC<ProfilePageTemplateProps> = ({
  avatarSrc,
  bio,
  stats,
  achievements,
  matches,
  friends,
  onBioChange,
}) => {
  return (
    <div className={styles.profilePageTemplate}>
      <ProfileHeader
        avatarSrc={avatarSrc}
        bio={bio}
        stats={stats}
        onBioChange={onBioChange}
      />
      <StatsSection stats={stats} />
      <AchievementsGrid achievements={achievements} />
      <MatchHistoryList matches={matches} />
      <FriendsList friends={friends} />
    </div>
  )
}

export default ProfilePageTemplate
