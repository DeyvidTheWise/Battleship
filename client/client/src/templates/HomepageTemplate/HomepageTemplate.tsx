import React from "react"
import { HeroSection } from "molecules"
import { QuickActionsSection, AnnouncementsCarousel } from "organisms"
import styles from "./HomepageTemplate.module.css"

interface HomepageTemplateProps {
  onPlayClick: () => void
  actions: {
    icon: "ship" | "chat" | "friend"
    title: string
    onClick: () => void
  }[]
  announcements: { title: string; content: string; image?: string }[]
}

const HomepageTemplate: React.FC<HomepageTemplateProps> = ({
  onPlayClick,
  actions,
  announcements,
}) => {
  return (
    <div className={styles.homepageTemplate}>
      <HeroSection onPlayClick={onPlayClick} />
      <QuickActionsSection actions={actions} />
      <AnnouncementsCarousel announcements={announcements} />
    </div>
  )
}

export default HomepageTemplate
