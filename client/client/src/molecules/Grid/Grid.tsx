// client/src/molecules/Grid/Grid.tsx
import React from "react"
import { Text } from "atoms"
import { GridRow } from "molecules"
import { GridProps } from "@shared-types"
import styles from "./Grid.module.css"

const Grid: React.FC<GridProps> = ({
  grid,
  label,
  onCellClick,
  onCellHover,
}) => {
  const columns = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

  // Compute the dynamic class name
  const dynamicClass = label.toLowerCase().replace(" ", "-")

  return (
    <div className={`${styles.gridContainer} ${styles[dynamicClass]}`}>
      <Text content={label} variant="label" />
      <div className={styles.gridHeader}>
        <div className={styles.gridCorner}></div>
        {columns.map((col, idx) => (
          <Text key={idx} content={col} variant="secondary" />
        ))}
      </div>
      {grid.map((row, rowIdx) => (
        <GridRow
          key={rowIdx}
          row={row}
          rowNumber={rowIdx + 1}
          onCellClick={(colIdx) => onCellClick(rowIdx, colIdx)}
          onCellHover={(colIdx) => onCellHover(rowIdx, colIdx)}
        />
      ))}
    </div>
  )
}

export default Grid
