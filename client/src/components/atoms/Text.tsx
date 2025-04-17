import React from "react"

interface TextProps {
  variant?: "h1" | "h2" | "p"
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}

const Text: React.FC<TextProps> = ({
  variant = "p",
  children,
  className = "",
  style,
}) => {
  if (variant === "h1") {
    return (
      <h1 className={`text-h1 ${className}`} style={style}>
        {children}
      </h1>
    )
  }
  if (variant === "h2") {
    return (
      <h2 className={`text-h2 ${className}`} style={style}>
        {children}
      </h2>
    )
  }
  return (
    <p className={`text-p ${className}`} style={style}>
      {children}
    </p>
  )
}

export default Text
