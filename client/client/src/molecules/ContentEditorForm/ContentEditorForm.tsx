import React, { useState } from "react"
import { Text, Button } from "atoms"
import styles from "./ContentEditorForm.module.css"

interface ContentEditorFormProps {
  content: string
  onContentChange: (content: string) => void
  onSave: () => void
  onSchedule: (date: string) => void
}

const ContentEditorForm: React.FC<ContentEditorFormProps> = ({
  content,
  onContentChange,
  onSave,
  onSchedule,
}) => {
  const [scheduleDate, setScheduleDate] = useState("")

  return (
    <div className={styles.contentEditorForm}>
      <Text content="Content Editor" variant="label" />
      <textarea
        className={styles.editor}
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder="Write your announcement..."
      />
      <div className={styles.actions}>
        <Button text="Save" onClick={onSave} />
        <input
          type="datetime-local"
          value={scheduleDate}
          onChange={(e) => setScheduleDate(e.target.value)}
          className={styles.scheduleInput}
        />
        <Button
          text="Schedule"
          onClick={() => onSchedule(scheduleDate)}
          variant="secondary"
        />
      </div>
    </div>
  )
}

export default ContentEditorForm
