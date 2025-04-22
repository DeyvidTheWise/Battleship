import React from "react"
import { Avatar, StatItem } from "atoms"
import styles from "./ProfileHeader.module.css"

interface ProfileHeaderProps {
  avatarSrc?: string
  bio: string
  stats: { label: string; value: string | number }[]
  onBioChange: (bio: string) => void
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  avatarSrc,
  bio,
  stats,
  onBioChange,
}) => {
  return (
    <div className={styles.profileHeader}>
      <Avatar src={avatarSrc} size={100} />
      <textarea
        className={styles.bioInput}
        value={bio}
        onChange={(e) => onBioChange(e.target.value)}
        placeholder="Write your bio..."
      />
      <div className={styles.stats}>
        {stats.map((stat, idx) => (
          <StatItem key={idx} label={stat.label} value={stat.value} />
        ))}
      </div>
    </div>
  )
}

export default ProfileHeader
