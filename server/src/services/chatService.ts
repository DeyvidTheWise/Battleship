const messages: {
  senderId: string
  gameId: string
  message: string
  timestamp: number
}[] = []

export const saveMessage = (
  senderId: string,
  gameId: string,
  message: string,
  timestamp: number = Date.now()
) => {
  const newMessage = {
    senderId,
    gameId,
    message,
    timestamp,
  }
  messages.push(newMessage)
  return newMessage
}

export const getDirectMessages = (senderId: string, receiverId: string) => {
  return messages.filter(
    (msg) =>
      (msg.senderId === senderId && msg.gameId === receiverId) ||
      (msg.senderId === receiverId && msg.gameId === senderId)
  )
}

export const getGameMessages = (gameId: string) => {
  return messages.filter((msg) => msg.gameId === gameId)
}
