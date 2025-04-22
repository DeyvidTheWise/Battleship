import React from "react"
import styles from "./Avatar.module.css"

interface AvatarProps {
  src?: string
  alt?: string
  size?: number
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  size = 100,
}) => {
  return (
    <img
      src={src || "https://via.placeholder.com/100"} // Placeholder image if src is not provided
      alt={alt}
      className={styles.avatar}
      style={{ width: size, height: size }}
    />
  )
}

export default Avatar
