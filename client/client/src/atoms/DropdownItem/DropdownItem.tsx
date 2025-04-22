import React from "react"
import styles from "./DropdownItem.module.css"

interface DropdownItemProps {
  label: string
  onClick: () => void
}

const DropdownItem: React.FC<DropdownItemProps> = ({ label, onClick }) => {
  return (
    <li className={styles.dropdownItem} onClick={onClick}>
      {label}
    </li>
  )
}

export default DropdownItem
