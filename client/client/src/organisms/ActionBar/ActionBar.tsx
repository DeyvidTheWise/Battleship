import React from "react"
import { Button } from "atoms"
import { ActionBarProps } from "@shared-types"
import styles from "./ActionBar.module.css"

const ActionBar: React.FC<ActionBarProps> = ({
  onRandomize,
  onEndTurn,
  onSurrender,
  isSetupPhase,
}) => {
  return (
    <div className={styles.actionBar}>
      {isSetupPhase && (
        <Button text="Randomize Placement" onClick={onRandomize} />
      )}
      <Button
        text="End Turn"
        onClick={onEndTurn}
        variant={isSetupPhase ? "disabled" : "primary"}
      />
      <Button text="Surrender" onClick={onSurrender} variant="secondary" />
    </div>
  )
}

export default ActionBar
