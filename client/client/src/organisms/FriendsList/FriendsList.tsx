import React from "react"
import { Text, Button } from "atoms"
import styles from "./FriendsList.module.css"

interface FriendsListProps {
  friends: {
    username: string
    isOnline: boolean
    onMessage: () => void
    onInvite: () => void
    onSpectate: () => void
  }[]
}

const FriendsList: React.FC<FriendsListProps> = ({ friends }) => {
  return (
    <div className={styles.friendsList}>
      {friends.map((friend, idx) => (
        <div key={idx} className={styles.friend}>
          <Text content={friend.username} variant="body" />
          <Text
            content={friend.isOnline ? "Online" : "Offline"}
            variant="secondary"
          />
          <div className={styles.actions}>
            <Button
              text="Message"
              onClick={friend.onMessage}
              variant="secondary"
            />
            <Button
              text="Invite"
              onClick={friend.onInvite}
              variant="secondary"
            />
            <Button
              text="Spectate"
              onClick={friend.onSpectate}
              variant="secondary"
            />
          </div>
        </div>
      ))}
    </div>
  )
}

export default FriendsList
