import React from "react"
import { HomepageTemplate } from "templates"
import styles from "./Homepage.module.css"

const Homepage: React.FC = () => {
  const actions = [
    {
      icon: "ship" as const,
      title: "1v1 Match",
      onClick: () => console.log("1v1 Match"),
    },
    {
      icon: "chat" as const,
      title: "Play vs AI",
      onClick: () => console.log("Play vs AI"),
    },
    {
      icon: "friend" as const,
      title: "Practice Mode",
      onClick: () => console.log("Practice Mode"),
    },
  ]

  const announcements = [
    {
      title: "New Update!",
      content: "Version 1.1 released.",
      image: "https://via.placeholder.com/200",
    },
    {
      title: "Event",
      content: "Join our tournament!",
      image: "https://via.placeholder.com/200",
    },
  ]

  return (
    <div className={styles.homepage}>
      <HomepageTemplate
        onPlayClick={() => console.log("Play Now")}
        actions={actions}
        announcements={announcements}
      />
    </div>
  )
}

export default Homepage
