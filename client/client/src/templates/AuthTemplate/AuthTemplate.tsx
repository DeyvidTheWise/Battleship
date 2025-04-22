import React from "react"
import { Text, Button } from "atoms"
import styles from "./AuthTemplate.module.css"

interface AuthTemplateProps {
  title: string
  email: string
  onEmailChange: (email: string) => void
  password: string
  onPasswordChange: (password: string) => void
  username?: string
  onUsernameChange?: (username: string) => void
  onSubmit: () => void
  onOAuth: (provider: "google" | "github") => void
  showForgotPassword?: boolean
}

const AuthTemplate: React.FC<AuthTemplateProps> = ({
  title,
  email,
  onEmailChange,
  password,
  onPasswordChange,
  username,
  onUsernameChange,
  onSubmit,
  onOAuth,
  showForgotPassword = false,
}) => {
  return (
    <div className={styles.authTemplate}>
      <Text content={title} variant="title" />
      <div className={styles.form}>
        {username !== undefined && onUsernameChange && (
          <input
            type="text"
            value={username}
            onChange={(e) => onUsernameChange(e.target.value)}
            placeholder="Username"
            className={styles.input}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          placeholder="Email"
          className={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          placeholder="Password"
          className={styles.input}
        />
        {showForgotPassword && (
          <Text content="Forgot Password?" variant="secondary" />
        )}
        <Button text={title} onClick={onSubmit} />
        <div className={styles.oauthButtons}>
          <Button
            text="Sign in with Google"
            onClick={() => onOAuth("google")}
            variant="secondary"
          />
          <Button
            text="Sign in with GitHub"
            onClick={() => onOAuth("github")}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthTemplate
