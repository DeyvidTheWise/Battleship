import React from "react"

interface ButtonProps {
  variant?: "primary" | "secondary" | "danger"
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  onClick,
  children,
  disabled,
  className = "",
  style,
}) => {
  return (
    <button
      className={`button ${variant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  )
}
