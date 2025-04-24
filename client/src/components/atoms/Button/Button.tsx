import * as React from "react"
import "./Button.css"


export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const variantClass = `btn-${variant}`
    const sizeClass = `btn-${size}`

    return (
      <button className={`btn ${variantClass} ${sizeClass} ${className}`} ref={ref} {...props}>
        {children}
      </button>
    )
  },
)

Button.displayName = "Button"

export const buttonVariants = (
  options: { variant?: ButtonProps["variant"]; size?: ButtonProps["size"]; className?: string } = {},
) => {
  const { variant = "default", size = "default", className = "" } = options
  const variantClass = `btn-${variant}`
  const sizeClass = `btn-${size}`

  return `btn ${variantClass} ${sizeClass} ${className}`
}
