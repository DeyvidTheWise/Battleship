import React from "react"
import { GridCell, Text } from "atoms"
import { GridRowProps } from "@shared-types"
import styles from "./GridRow.module.css"

const GridRow: React.FC<GridRowProps> = ({
  row,
  rowNumber,
  onCellClick,
  onCellHover,
}) => {
  return (
    <div className={styles.gridRow}>
      <Text content={rowNumber.toString()} variant="secondary" />
      {row.map((cell, colIdx) => (
        <GridCell
          key={colIdx}
          state={cell}
          onClick={() => onCellClick(colIdx)}
          onHover={() => onCellHover(colIdx)}
        />
      ))}
    </div>
  )
}

export default GridRow
