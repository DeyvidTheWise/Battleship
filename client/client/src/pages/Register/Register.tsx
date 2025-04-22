import React, { useState } from "react"
import { AuthTemplate } from "templates"
import styles from "./Register.module.css"

const Register: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")

  const handleSubmit = () => {
    console.log("Register:", { email, password, username })
  }

  const handleOAuth = (provider: "google" | "github") => {
    console.log(`Sign up with ${provider}`)
  }

  return (
    <div className={styles.register}>
      <AuthTemplate
        title="Register"
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        username={username}
        onUsernameChange={setUsername}
        onSubmit={handleSubmit}
        onOAuth={handleOAuth}
      />
    </div>
  )
}

export default Register
