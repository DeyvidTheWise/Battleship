import React from "react"
import styles from "./Icon.module.css"

interface IconProps {
  name: "ship" | "chat" | "friend" // Add more icon types as needed
  variant?: "active" | "inactive"
}

const Icon: React.FC<IconProps> = ({ name, variant = "inactive" }) => {
  // Simple SVG placeholders for icons (can be replaced with real SVGs or an icon library)
  const renderIcon = () => {
    switch (name) {
      case "ship":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v20M8 6h8M4 10h16" />
          </svg>
        )
      case "chat":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )
      case "friend":
        return (
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <span className={`${styles.icon} ${styles[variant]}`}>{renderIcon()}</span>
  )
}

export default Icon
