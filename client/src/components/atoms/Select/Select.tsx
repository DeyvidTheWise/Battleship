import * as React from "react"
import "./Select.css"


export const Select: React.FC<{
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
}> = ({ children }) => {
  return <div className="select">{children}</div>
}

export const SelectTrigger: React.FC<
  React.HTMLAttributes<HTMLButtonElement> & {
    children: React.ReactNode
  }
> = ({ children, className = "", ...props }) => {
  return (
    <button className={`select-trigger ${className}`} {...props}>
      {children}
    </button>
  )
}

export const SelectValue: React.FC<{
  placeholder?: string
  children?: React.ReactNode
}> = ({ placeholder, children }) => {
  return <span className="select-value">{children || placeholder}</span>
}

export const SelectContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = "",
  ...props
}) => {
  return (
    <div className={`select-content ${className}`} {...props}>
      {children}
    </div>
  )
}


export const SelectItem: React.FC<React.HTMLAttributes<HTMLDivElement> & { value?: string }> = ({
  children,
  className = "",
  value,
  ...props
}) => {
  return (
    <div className={`select-item ${className}`} data-value={value} {...props}>
      {children}
    </div>
  )
}

export const SelectGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => <div ref={ref} className={`select-group ${className}`} {...props} />,
)
SelectGroup.displayName = "SelectGroup"

export const SelectLabel = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className = "", ...props }, ref) => <label ref={ref} className={`select-label ${className}`} {...props} />,
)
SelectLabel.displayName = "SelectLabel"

export const SelectSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => <div ref={ref} className={`select-separator ${className}`} {...props} />,
)
SelectSeparator.displayName = "SelectSeparator"

export const SelectScrollUpButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`select-scroll-up-button ${className}`} {...props}>
      ▲
    </div>
  ),
)
SelectScrollUpButton.displayName = "SelectScrollUpButton"

export const SelectScrollDownButton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = "", ...props }, ref) => (
    <div ref={ref} className={`select-scroll-down-button ${className}`} {...props}>
      ▼
    </div>
  ),
)
SelectScrollDownButton.displayName = "SelectScrollDownButton"
