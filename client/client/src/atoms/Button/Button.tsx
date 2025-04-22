import React from "react"
import { ButtonProps } from "@shared-types"
import styles from "./Button.module.css"

const Button: React.FC<ButtonProps> = ({
  text,
  onClick,
  variant = "primary",
}) => {
  return (
    <button onClick={onClick} className={`${styles.button} ${styles[variant]}`}>
      {text}
    </button>
  )
}

export default Button
