import React from "react"
import { ChartPoint } from "atoms"
import styles from "./Chart.module.css"

interface ChartProps {
  data: { x: number; y: number; value: number }[]
  width?: number
  height?: number
}

const Chart: React.FC<ChartProps> = ({ data, width = 300, height = 200 }) => {
  return (
    <svg width={width} height={height} className={styles.chart}>
      <polyline
        points={data.map((point) => `${point.x},${point.y}`).join(" ")}
        fill="none"
        stroke="var(--seafoam-green)"
        strokeWidth="2"
      />
      {data.map((point, idx) => (
        <ChartPoint key={idx} x={point.x} y={point.y} value={point.value} />
      ))}
    </svg>
  )
}

export default Chart
