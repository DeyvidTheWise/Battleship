import React from "react"
import { Text } from "atoms"
import styles from "./AnnouncementCard.module.css"

interface AnnouncementCardProps {
  title: string
  content: string
  image?: string
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  title,
  content,
  image,
}) => {
  return (
    <div className={styles.announcementCard}>
      {image && <img src={image} alt={title} className={styles.image} />}
      <Text content={title} variant="body" />
      <Text content={content} variant="secondary" />
    </div>
  )
}

export default AnnouncementCard
