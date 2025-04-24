import { Button } from "../../atoms/Button/Button"
import { Flag } from "lucide-react"
import "./ActionBar.css"

interface ActionBarProps {
  gamePhase: "setup" | "playing" | "ended"
  onRandomize: () => void
  onSurrender: () => void
  onPlayAgain: () => void
  winner: "player" | "opponent" | null
}

export default function ActionBar({ gamePhase, onRandomize, onSurrender, onPlayAgain, winner }: ActionBarProps) {
  return (
    <div className="action-bar">

      {gamePhase === "playing" && (
        <Button variant="outline" className="surrender-btn" onClick={onSurrender}>
          <Flag className="mr-2 h-4 w-4" />
          Surrender
        </Button>
      )}

      {gamePhase === "ended" && (
        <Button className="play-again-btn" onClick={onPlayAgain}>
          Play Again
        </Button>
      )}
    </div>
  )
}
