import React from "react"
import { TextProps } from "@shared-types"
import styles from "./Text.module.css"

const Text: React.FC<TextProps> = ({ content, variant }) => {
  return <span className={`${styles.text} ${styles[variant]}`}>{content}</span>
}

export default Text
