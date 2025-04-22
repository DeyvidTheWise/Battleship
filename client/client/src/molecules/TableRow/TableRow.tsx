import React from "react"
import { TableCell } from "atoms"
import styles from "./TableRow.module.css"

interface TableRowProps {
  data: (string | number)[]
  isHighlighted?: boolean
}

const TableRow: React.FC<TableRowProps> = ({ data, isHighlighted = false }) => {
  return (
    <tr className={styles.tableRow}>
      {data.map((item, idx) => (
        <TableCell key={idx} content={item} isHighlighted={isHighlighted} />
      ))}
    </tr>
  )
}

export default TableRow
