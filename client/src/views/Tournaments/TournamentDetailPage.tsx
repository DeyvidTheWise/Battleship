"use client"

import type React from "react"
import { useParams } from "react-router-dom"
import "./TournamentsPage.css"

const TournamentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="tournament-detail-container">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Tournament Details</h1>
      </div>
    </div>
  )
}

export default TournamentDetailPage
