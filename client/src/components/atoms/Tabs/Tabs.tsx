import type React from "react"
import "./Tabs.css"

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  className?: string
}

export const Tabs: React.FC<TabsProps> = ({ defaultValue, value, onValueChange, children, className = "" }) => {
  return <div className={`tabs ${className}`}>{children}</div>
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export const TabsList: React.FC<TabsListProps> = ({ children, className = "" }) => {
  return <div className={`tabs-list ${className}`}>{children}</div>
}

interface TabsTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  children: React.ReactNode
  className?: string
  "data-state"?: "active" | "inactive"
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, className = "", value, ...props }) => {
  return (
    <button className={`tabs-trigger ${className}`} data-state={props["data-state"] || "inactive"} {...props}>
      {children}
    </button>
  )
}

interface TabsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  children: React.ReactNode
  className?: string
  "data-state"?: "active" | "inactive"
}

export const TabsContent: React.FC<TabsContentProps> = ({ children, className = "", value, ...props }) => {
  return (
    <Tabs>
      <div className={`tabs-content ${className}`} data-state={props["data-state"] || "inactive"} {...props}>
        {children}
      </div>
    </Tabs>
  )
}
