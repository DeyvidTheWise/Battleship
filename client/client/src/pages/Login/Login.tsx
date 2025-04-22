import React, { useState } from "react"
import { AuthTemplate } from "templates"
import styles from "./Login.module.css"

const Login: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = () => {
    console.log("Login:", { email, password })
  }

  const handleOAuth = (provider: "google" | "github") => {
    console.log(`Sign in with ${provider}`)
  }

  return (
    <div className={styles.login}>
      <AuthTemplate
        title="Login"
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        onSubmit={handleSubmit}
        onOAuth={handleOAuth}
        showForgotPassword
      />
    </div>
  )
}

export default Login
