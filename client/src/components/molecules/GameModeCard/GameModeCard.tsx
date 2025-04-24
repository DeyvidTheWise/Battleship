import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../atoms/Card/Card"
import { Lock } from "lucide-react"
import type { ReactNode } from "react"
import "./GameModeCard.css"

interface GameModeCardProps {
  title: string
  description: string
  icon: ReactNode
  locked?: boolean
  onClick?: () => void
  href?: string
}

export function GameModeCard({ title, description, icon, locked = false, onClick, href }: GameModeCardProps) {
  const handleClick = () => {
    if (locked) return
    if (onClick) onClick()
    if (href) window.location.href = href
  }

  return (
    <Card className={`game-mode-card ${locked ? "locked" : ""}`} onClick={handleClick}>
      <CardHeader>
        <div className="game-mode-header">
          <div className="game-mode-icon">{icon}</div>
          {locked && <Lock className="lock-icon" />}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  )
}
