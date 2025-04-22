import React from "react"
import { SidebarItem } from "atoms"
import styles from "./SidebarMenu.module.css"

interface SidebarMenuProps {
  items: {
    label: string
    icon: "ship" | "chat" | "friend"
    onClick: () => void
    isActive?: boolean
  }[]
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ items }) => {
  return (
    <div className={styles.sidebarMenu}>
      {items.map((item, idx) => (
        <SidebarItem
          key={idx}
          label={item.label}
          icon={item.icon}
          onClick={item.onClick}
          isActive={item.isActive}
        />
      ))}
    </div>
  )
}

export default SidebarMenu
