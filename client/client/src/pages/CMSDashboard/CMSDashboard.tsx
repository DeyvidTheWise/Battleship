import React, { useState } from "react"
import { CMSDashboardTemplate } from "templates"
import styles from "./CMSDashboard.module.css"

const CMSDashboard: React.FC = () => {
  const [content, setContent] = useState("")

  const sidebarItems = [
    {
      label: "Content",
      icon: "ship" as const,
      onClick: () => console.log("Content clicked"),
      isActive: true,
    },
    {
      label: "Users",
      icon: "friend" as const,
      onClick: () => console.log("Users clicked"),
    },
    {
      label: "Analytics",
      icon: "chat" as const,
      onClick: () => console.log("Analytics clicked"),
    },
  ]

  const charts = [
    {
      data: [
        { x: 10, y: 50, value: 50 },
        { x: 50, y: 30, value: 30 },
        { x: 90, y: 70, value: 70 },
      ],
    },
    {
      data: [
        { x: 20, y: 60, value: 60 },
        { x: 60, y: 20, value: 20 },
        { x: 100, y: 80, value: 80 },
      ],
    },
  ]

  const users = [
    {
      username: "User1",
      status: "Active",
      lastActive: "2025-04-22",
      onBan: () => console.log("Ban User1"),
      onWarn: () => console.log("Warn User1"),
    },
    {
      username: "User2",
      status: "Suspended",
      lastActive: "2025-04-20",
      onBan: () => console.log("Ban User2"),
      onWarn: () => console.log("Warn User2"),
    },
  ]

  return (
    <div className={styles.cmsDashboard}>
      <CMSDashboardTemplate
        sidebarItems={sidebarItems}
        content={content}
        onContentChange={setContent}
        onSave={() => console.log("Content saved:", content)}
        onSchedule={(date) => console.log("Schedule for:", date)}
        charts={charts}
        onExport={() => console.log("Export analytics")}
        users={users}
      />
    </div>
  )
}

export default CMSDashboard
