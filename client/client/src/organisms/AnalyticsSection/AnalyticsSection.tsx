import React from "react"
import { Chart } from "molecules"
import { Text, Button } from "atoms"
import styles from "./AnalyticsSection.module.css"

interface AnalyticsSectionProps {
  charts: { data: { x: number; y: number; value: number }[] }[]
  onExport: () => void
}

const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  charts,
  onExport,
}) => {
  return (
    <div className={styles.analyticsSection}>
      <Text content="Analytics" variant="label" />
      <div className={styles.charts}>
        {charts.map((chart, idx) => (
          <Chart key={idx} data={chart.data} />
        ))}
      </div>
      <Button text="Export" onClick={onExport} />
    </div>
  )
}

export default AnalyticsSection
