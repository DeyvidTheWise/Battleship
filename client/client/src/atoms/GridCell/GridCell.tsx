import React from "react"
import { GridCellProps } from "@shared-types"
import styles from "./GridCell.module.css"

const GridCell: React.FC<GridCellProps> = ({ state, onClick, onHover }) => {
  return (
    <div
      className={`${styles.gridCell} ${styles[state]}`}
      onClick={onClick}
      onMouseEnter={onHover}
    >
      {state === "hit" && (
        <span className={`${styles.dot} ${styles.hit}`}>•</span>
      )}
      {state === "miss" && (
        <span className={`${styles.dot} ${styles.miss}`}>•</span>
      )}
    </div>
  )
}

export default GridCell
