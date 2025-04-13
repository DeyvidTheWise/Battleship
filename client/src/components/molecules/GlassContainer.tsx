import React from "react"

interface GlassContainerProps {
  children: React.ReactNode
  style?: React.CSSProperties
}

const GlassContainer: React.FC<GlassContainerProps> = ({ children, style }) => (
  <div className="glass-container" style={style}>
    {children}
  </div>
)

export default GlassContainer
