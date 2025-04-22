import React, { useEffect, useState } from "react"
import { TimerRingProps } from "@shared-types"
import styles from "./TimerRing.module.css"

const TimerRing: React.FC<TimerRingProps> = ({ time, totalTime }) => {
  const [progress, setProgress] = useState((time / totalTime) * 100)

  useEffect(() => {
    setProgress((time / totalTime) * 100)
  }, [time, totalTime])

  return (
    <div className={styles.timerRing}>
      <svg width="60" height="60">
        <circle
          cx="30"
          cy="30"
          r="28"
          fill="none"
          stroke={time <= 10 ? "var(--coral-red)" : "var(--seafoam-green)"}
          strokeWidth="4"
          strokeDasharray={`${progress * 1.76}, 176`}
          transform="rotate(-90 30 30)"
        />
      </svg>
      <span className={styles.timerText}>{time}</span>
    </div>
  )
}

export default TimerRing
