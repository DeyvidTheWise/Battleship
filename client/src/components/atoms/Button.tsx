import React from "react"

interface ButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  children: React.ReactNode
  variant?: "primary" | "secondary" | "danger"
  style?: React.CSSProperties
  disabled?: boolean
  type?: "button" | "submit" | "reset" // Add type prop
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  style,
  disabled,
  type = "button",
}) => (
  <button
    onClick={onClick}
    className={`button ${variant}`}
    style={style}
    disabled={disabled}
    type={type}
  >
    {children}
  </button>
)

export default Button
