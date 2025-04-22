import React from "react"
import { SidebarMenu } from "molecules"
import styles from "./Sidebar.module.css"

interface SidebarProps {
  items: {
    label: string
    icon: "ship" | "chat" | "friend"
    onClick: () => void
    isActive?: boolean
  }[]
}

const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <div className={styles.sidebar}>
      <SidebarMenu items={items} />
    </div>
  )
}

export default Sidebar
