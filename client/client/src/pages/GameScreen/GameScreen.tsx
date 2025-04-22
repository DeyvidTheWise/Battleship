import React, { useState, useEffect } from "react"
import { GameScreenTemplate } from "templates"
import { io } from "socket.io-client"
import { GridState, ChatMessageProps } from "@shared-types"
import styles from "./GameScreen.module.css"

const GameScreen: React.FC = () => {
  const [yourGrid, setYourGrid] = useState<GridState[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill("untouched"))
  )
  const [opponentGrid, setOpponentGrid] = useState<GridState[][]>(
    Array(10)
      .fill(null)
      .map(() => Array(10).fill("untouched"))
  )
  const [timer, setTimer] = useState(30)
  const [totalTime] = useState(30)
  const [chatMessages, setChatMessages] = useState<ChatMessageProps[]>([])
  const [isSetupPhase, setIsSetupPhase] = useState(true)

  useEffect(() => {
    const socket = io("http://localhost:3000")
    socket.on("timer-update", (time: number) => {
      setTimer(time)
    })
    socket.on(
      "game-update",
      (update: { yourGrid: GridState[][]; opponentGrid: GridState[][] }) => {
        setYourGrid(update.yourGrid)
        setOpponentGrid(update.opponentGrid)
      }
    )
    socket.on("chat-message", (message: ChatMessageProps) => {
      setChatMessages((prev) => [...prev, message])
    })
    return () => {
      socket.disconnect()
    }
  }, [])

  const handleCellClick = (row: number, col: number) => {
    if (!isSetupPhase) {
      // Simulate a shot
      const newOpponentGrid = [...opponentGrid]
      newOpponentGrid[row][col] =
        newOpponentGrid[row][col] === "hit" ? "hit" : "miss"
      setOpponentGrid(newOpponentGrid)
    }
  }

  const handleCellHover = (row: number, col: number) => {
    console.log(`Hovering over cell ${row}, ${col}`)
  }

  const handleSendMessage = (message: string) => {
    const newMessage: ChatMessageProps = {
      sender: "You",
      content: message,
      timestamp: new Date().toISOString(),
    }
    setChatMessages((prev) => [...prev, newMessage])
  }

  const handleRandomize = () => {
    // Simulate random ship placement
    const newGrid = Array(10)
      .fill(null)
      .map(() => Array(10).fill("untouched")) as GridState[][]
    // Example placement (simplified)
    newGrid[0][0] = "ship"
    newGrid[0][1] = "ship"
    setYourGrid(newGrid)
    setIsSetupPhase(false)
  }

  const handleEndTurn = () => {
    console.log("Turn ended")
  }

  const handleSurrender = () => {
    console.log("Surrendered")
  }

  return (
    <div className={styles.gameScreen}>
      <GameScreenTemplate
        yourGrid={yourGrid}
        opponentGrid={opponentGrid}
        timer={timer}
        totalTime={totalTime}
        chatMessages={chatMessages}
        onCellClick={handleCellClick}
        onCellHover={handleCellHover}
        onSendMessage={handleSendMessage}
        onRandomize={handleRandomize}
        onEndTurn={handleEndTurn}
        onSurrender={handleSurrender}
        isSetupPhase={isSetupPhase}
      />
    </div>
  )
}

export default GameScreen
