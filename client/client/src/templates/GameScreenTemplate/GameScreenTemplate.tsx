import React from "react"
import { GameBoard, ActionBar } from "organisms"
import { GameScreenTemplateProps } from "@shared-types"
import styles from "./GameScreenTemplate.module.css"

const GameScreenTemplate: React.FC<GameScreenTemplateProps> = ({
  yourGrid,
  opponentGrid,
  timer,
  totalTime,
  chatMessages,
  onCellClick,
  onCellHover,
  onSendMessage,
  onRandomize,
  onEndTurn,
  onSurrender,
  isSetupPhase,
}) => {
  return (
    <div className={styles.gameScreenTemplate}>
      <div className={styles.mainContent}>
        <GameBoard
          yourGrid={yourGrid}
          opponentGrid={opponentGrid}
          timer={timer}
          totalTime={totalTime}
          onCellClick={onCellClick}
          onCellHover={onCellHover}
        />
        {/* <ChatPanel messages={chatMessages} onSendMessage={onSendMessage} /> */}
      </div>
      <ActionBar
        onRandomize={onRandomize}
        onEndTurn={onEndTurn}
        onSurrender={onSurrender}
        isSetupPhase={isSetupPhase}
      />
    </div>
  )
}

export default GameScreenTemplate
