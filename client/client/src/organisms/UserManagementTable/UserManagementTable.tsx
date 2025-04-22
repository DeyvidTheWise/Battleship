import React from "react"
import { Text, Button } from "atoms"
import styles from "./UserManagementTable.module.css"

interface UserManagementTableProps {
  users: {
    username: string
    status: string
    lastActive: string
    onBan: () => void
    onWarn: () => void
  }[]
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users }) => {
  return (
    <table className={styles.userManagementTable}>
      <thead>
        <tr>
          <th>Username</th>
          <th>Status</th>
          <th>Last Active</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user, idx) => (
          <tr key={idx}>
            <td>
              <Text content={user.username} variant="body" />
            </td>
            <td>
              <Text content={user.status} variant="body" />
            </td>
            <td>
              <Text content={user.lastActive} variant="body" />
            </td>
            <td className={styles.actions}>
              <Button text="Ban" onClick={user.onBan} variant="secondary" />
              <Button text="Warn" onClick={user.onWarn} variant="secondary" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default UserManagementTable
