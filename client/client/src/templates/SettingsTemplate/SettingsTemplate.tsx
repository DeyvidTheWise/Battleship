import React from "react"
import { Text, Button } from "atoms"
import styles from "./SettingsTemplate.module.css"

interface SettingsTemplateProps {
  theme: "light" | "dark" | "colorblind"
  onThemeChange: (theme: "light" | "dark" | "colorblind") => void
  fontSize: number
  onFontSizeChange: (fontSize: number) => void
  animationsEnabled: boolean
  onAnimationsChange: (enabled: boolean) => void
  onUpdateEmail: (email: string) => void
  onUpdatePassword: (password: string) => void
  onDeleteAccount: () => void
}

const SettingsTemplate: React.FC<SettingsTemplateProps> = ({
  theme,
  onThemeChange,
  fontSize,
  onFontSizeChange,
  animationsEnabled,
  onAnimationsChange,
  onUpdateEmail,
  onUpdatePassword,
  onDeleteAccount,
}) => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  return (
    <div className={styles.settingsTemplate}>
      <Text content="Settings" variant="title" />
      <div className={styles.section}>
        <Text content="Theme" variant="label" />
        <select
          value={theme}
          onChange={(e) =>
            onThemeChange(e.target.value as "light" | "dark" | "colorblind")
          }
          className={styles.select}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="colorblind">Colorblind</option>
        </select>
      </div>
      <div className={styles.section}>
        <Text content="Font Size" variant="label" />
        <input
          type="number"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className={styles.input}
        />
      </div>
      <div className={styles.section}>
        <Text content="Animations" variant="label" />
        <input
          type="checkbox"
          checked={animationsEnabled}
          onChange={(e) => onAnimationsChange(e.target.checked)}
        />
      </div>
      <div className={styles.section}>
        <Text content="Update Email" variant="label" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="New Email"
          className={styles.input}
        />
        <Button text="Update Email" onClick={() => onUpdateEmail(email)} />
      </div>
      <div className={styles.section}>
        <Text content="Update Password" variant="label" />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className={styles.input}
        />
        <Button
          text="Update Password"
          onClick={() => onUpdatePassword(password)}
        />
      </div>
      <div className={styles.section}>
        <Button
          text="Delete Account"
          onClick={onDeleteAccount}
          variant="secondary"
        />
      </div>
    </div>
  )
}

export default SettingsTemplate
