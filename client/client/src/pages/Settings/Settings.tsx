import React, { useState } from "react"
import { SettingsTemplate } from "templates"
import styles from "./Settings.module.css"

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark" | "colorblind">("light")
  const [fontSize, setFontSize] = useState(16)
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  const handleUpdateEmail = (email: string) => {
    console.log("Update email:", email)
  }

  const handleUpdatePassword = (password: string) => {
    console.log("Update password:", password)
  }

  const handleDeleteAccount = () => {
    console.log("Delete account")
  }

  return (
    <div className={styles.settings}>
      <SettingsTemplate
        theme={theme}
        onThemeChange={setTheme}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        animationsEnabled={animationsEnabled}
        onAnimationsChange={setAnimationsEnabled}
        onUpdateEmail={handleUpdateEmail}
        onUpdatePassword={handleUpdatePassword}
        onDeleteAccount={handleDeleteAccount}
      />
    </div>
  )
}

export default Settings
