import React from "react"
import styles from "./ChartPoint.module.css"

interface ChartPointProps {
  x: number
  y: number
  value: number
}

const ChartPoint: React.FC<ChartPointProps> = ({ x, y, value }) => {
  return (
    <g>
      <circle cx={x} cy={y} r="4" className={styles.chartPoint} />
      <text x={x} y={y - 15} className={styles.label}>
        {value}
      </text>
    </g>
  )
}

export default ChartPoint
