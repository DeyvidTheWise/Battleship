import React from "react"
import { TimerRing } from "atoms"
import { Grid } from "molecules"
import { GameBoardProps } from "@shared-types"
import styles from "./GameBoard.module.css"

const GameBoard: React.FC<GameBoardProps> = ({
  yourGrid,
  opponentGrid,
  timer,
  totalTime,
  onCellClick,
  onCellHover,
}) => {
  return (
    <div className={styles.gameBoard}>
      <TimerRing time={timer} totalTime={totalTime} />
      <div className={styles.grids}>
        <Grid
          grid={yourGrid}
          label="YOUR FLEET"
          onCellClick={() => {}}
          onCellHover={() => {}}
        />
        <Grid
          grid={opponentGrid}
          label="OPPONENT"
          onCellClick={onCellClick}
          onCellHover={onCellHover}
        />
      </div>
    </div>
  )
}

export default GameBoard
