import React from "react"
import {
  Sidebar,
  ContentEditorSection,
  AnalyticsSection,
  UserManagementTable,
} from "organisms"
import styles from "./CMSDashboardTemplate.module.css"

interface CMSDashboardTemplateProps {
  sidebarItems: {
    label: string
    icon: "ship" | "chat" | "friend"
    onClick: () => void
    isActive?: boolean
  }[]
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onSchedule: (date: string) => void
  charts: { data: { x: number; y: number; value: number }[] }[]
  onExport: () => void
  users: {
    username: string
    status: string
    lastActive: string
    onBan: () => void
    onWarn: () => void
  }[]
}

const CMSDashboardTemplate: React.FC<CMSDashboardTemplateProps> = ({
  sidebarItems,
  content,
  onContentChange,
  onSave,
  onSchedule,
  charts,
  onExport,
  users,
}) => {
  return (
    <div className={styles.cmsDashboardTemplate}>
      <Sidebar items={sidebarItems} />
      <div className={styles.mainContent}>
        <ContentEditorSection
          content={content}
          onContentChange={onContentChange}
          onSave={onSave}
          onSchedule={onSchedule}
        />
        <AnalyticsSection charts={charts} onExport={onExport} />
        <UserManagementTable users={users} />
      </div>
    </div>
  )
}

export default CMSDashboardTemplate
