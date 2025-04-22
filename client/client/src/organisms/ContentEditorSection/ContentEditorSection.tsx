import React from "react"
import { ContentEditorForm } from "molecules"
import styles from "./ContentEditorSection.module.css"

interface ContentEditorSectionProps {
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onSchedule: (date: string) => void
}

const ContentEditorSection: React.FC<ContentEditorSectionProps> = ({
  content,
  onContentChange,
  onSave,
  onSchedule,
}) => {
  return (
    <div className={styles.contentEditorSection}>
      <ContentEditorForm
        content={content}
        onContentChange={onContentChange}
        onSave={onSave}
        onSchedule={onSchedule}
      />
    </div>
  )
}

export default ContentEditorSection
