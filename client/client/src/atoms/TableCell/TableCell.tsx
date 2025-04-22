import React from "react"
import styles from "./TableCell.module.css"

interface TableCellProps {
  content: string | number
  isHighlighted?: boolean
}

const TableCell: React.FC<TableCellProps> = ({
  content,
  isHighlighted = false,
}) => {
  return (
    <td
      className={`${styles.tableCell} ${
        isHighlighted ? styles.highlighted : ""
      }`}
    >
      {content}
    </td>
  )
}

export default TableCell
