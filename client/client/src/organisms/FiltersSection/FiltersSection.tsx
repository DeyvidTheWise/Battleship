import React from "react"
import { FilterDropdown } from "molecules"
import styles from "./FiltersSection.module.css"

interface FiltersSectionProps {
  onPeriodChange: (period: string) => void
  onRegionChange: (region: string) => void
}

const FiltersSection: React.FC<FiltersSectionProps> = ({
  onPeriodChange,
  onRegionChange,
}) => {
  return (
    <div className={styles.filtersSection}>
      <FilterDropdown
        label="Period"
        options={["Weekly", "Monthly"]}
        onSelect={onPeriodChange}
      />
      <FilterDropdown
        label="Region"
        options={["Global", "North America", "Europe"]}
        onSelect={onRegionChange}
      />
    </div>
  )
}

export default FiltersSection
