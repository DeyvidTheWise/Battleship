import React, { useState } from "react"
import { Text, DropdownItem } from "atoms"
import styles from "./FilterDropdown.module.css"

interface FilterDropdownProps {
  label: string
  options: string[]
  onSelect: (option: string) => void
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={styles.filterDropdown}>
      <Text
        content={label}
        variant="label"
        onClick={() => setIsOpen(!isOpen)}
      />
      {isOpen && (
        <ul className={styles.dropdownList}>
          {options.map((option, idx) => (
            <DropdownItem
              key={idx}
              label={option}
              onClick={() => {
                onSelect(option)
                setIsOpen(false)
              }}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default FilterDropdown
