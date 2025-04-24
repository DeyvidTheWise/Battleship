import type { Request, Response } from "express"
import {
  getTournaments,
  getTournament,
  createNewTournament,
  updateTournamentDetails,
  addPlayerToTournament,
  removePlayerFromTournament,
  checkPlayerInTournament,
} from "./model"

export const getAllTournaments = async (req: Request, res: Response) => {
  try {
    const tournaments = await getTournaments()
    res.json({ tournaments })
  } catch (error) {
    console.error("Get tournaments error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getTournamentById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const tournament = await getTournament(Number.parseInt(id))

    if (!tournament) {
      return res.status(404).json({ message: "Tournament not found" })
    }

    res.json({ tournament })
  } catch (error) {
    console.error("Get tournament error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createTournament = async (req: Request, res: Response) => {
  try {
    const { name, description, startDate, endDate, maxPlayers, prize } =
      req.body

    const tournamentId = await createNewTournament({
      name,
      description,
      start_date: new Date(startDate),
      end_date: new Date(endDate),
      max_players: maxPlayers,
      prize,
    })

    const tournament = await getTournament(tournamentId)
    res.status(201).json({ tournament })
  } catch (error) {
    console.error("Create tournament error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const updateTournament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { name, description, startDate, endDate, maxPlayers, prize, status } =
      req.body

    const success = await updateTournamentDetails(Number.parseInt(id), {
      name,
      description,
      start_date: startDate ? new Date(startDate) : undefined,
      end_date: endDate ? new Date(endDate) : undefined,
      max_players: maxPlayers,
      prize,
      status,
    })

    if (!success) {
      return res.status(404).json({ message: "Tournament not found" })
    }

    const tournament = await getTournament(Number.parseInt(id))
    res.json({ tournament })
  } catch (error) {
    console.error("Update tournament error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const joinTournament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    // Check if user is already in tournament
    const isInTournament = await checkPlayerInTournament(
      Number.parseInt(id),
      userId
    )
    if (isInTournament) {
      return res.status(400).json({ message: "Already joined this tournament" })
    }

    await addPlayerToTournament(Number.parseInt(id), userId)
    res.status(200).json({ message: "Successfully joined tournament" })
  } catch (error) {
    console.error("Join tournament error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const leaveTournament = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User ID not found" })
    }

    // Check if user is in tournament
    const isInTournament = await checkPlayerInTournament(
      Number.parseInt(id),
      userId
    )
    if (!isInTournament) {
      return res.status(400).json({ message: "Not in this tournament" })
    }

    await removePlayerFromTournament(Number.parseInt(id), userId)
    res.status(200).json({ message: "Successfully left tournament" })
  } catch (error) {
    console.error("Leave tournament error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
