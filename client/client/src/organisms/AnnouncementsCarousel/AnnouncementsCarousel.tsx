import React from "react"
import { AnnouncementCard } from "molecules"
import styles from "./AnnouncementsCarousel.module.css"

interface AnnouncementsCarouselProps {
  announcements: { title: string; content: string; image?: string }[]
}

const AnnouncementsCarousel: React.FC<AnnouncementsCarouselProps> = ({
  announcements,
}) => {
  return (
    <div className={styles.announcementsCarousel}>
      {announcements.map((announcement, idx) => (
        <AnnouncementCard
          key={idx}
          title={announcement.title}
          content={announcement.content}
          image={announcement.image}
        />
      ))}
    </div>
  )
}

export default AnnouncementsCarousel
