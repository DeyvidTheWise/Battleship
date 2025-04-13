import { Request, Response } from "express"
import {
  sendFriendRequest,
  acceptFriendRequest,
  getFriends,
  getFriendRequests,
} from "../services/friendService"

export const sendFriendRequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const { friendId } = req.body
  try {
    await sendFriendRequest(req.user.id, friendId)
    res.json({ message: "Friend request sent" })
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const acceptFriendRequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  const { friendId } = req.body
  try {
    await acceptFriendRequest(req.user.id, friendId)
    res.json({ message: "Friend request accepted" })
  } catch (error) {
    res.status(400).json({ error: (error as Error).message })
  }
}

export const getFriendsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  try {
    const friends = await getFriends(req.user.id)
    res.json(friends)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch friends" })
  }
}

export const getFriendRequestsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ error: "Unauthorized" })
    return
  }

  try {
    const requests = await getFriendRequests(req.user.id)
    res.json(requests)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch friend requests" })
  }
}
