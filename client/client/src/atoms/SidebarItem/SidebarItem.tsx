import React from "react"
import { Icon } from "atoms"
import styles from "./SidebarItem.module.css"

interface SidebarItemProps {
  label: string
  icon: "ship" | "chat" | "friend" // Add more icons as needed
  onClick: () => void
  isActive?: boolean
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  label,
  icon,
  onClick,
  isActive = false,
}) => {
  return (
    <div
      className={`${styles.sidebarItem} ${isActive ? styles.active : ""}`}
      onClick={onClick}
    >
      <Icon name={icon} variant={isActive ? "active" : "inactive"} />
      <span>{label}</span>
    </div>
  )
}

export default SidebarItem
