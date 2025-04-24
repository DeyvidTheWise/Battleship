import { io, type Socket } from "socket.io-client"

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001"

let socket: Socket | null = null

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SERVER_URL, {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })
  }
  return socket
}

export const connectSocket = (): Promise<Socket> => {
  return new Promise((resolve, reject) => {
    const socket = getSocket()

    if (socket.connected) {
      resolve(socket)
      return
    }

    socket.connect()

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id)
      resolve(socket)
    })

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error)
      reject(error)
    })
  })
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    console.log("Socket disconnected")
  }
}
