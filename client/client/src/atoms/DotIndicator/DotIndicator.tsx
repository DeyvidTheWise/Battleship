import React from "react"
import styles from "./DotIndicator.module.css"

interface DotIndicatorProps {
  variant: "hit" | "miss"
}

const DotIndicator: React.FC<DotIndicatorProps> = ({ variant }) => {
  return <span className={`${styles.dot} ${styles[variant]}`}>•</span>
}

export default DotIndicator
