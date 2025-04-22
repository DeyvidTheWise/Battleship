import { Request, Response } from "express"
import {
  getFriends,
  addFriend,
  sendChatMessage,
  updateProfile,
} from "./social.service"

export const getFriendsController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id
    const friends = await getFriends(user_id)
    res.status(200).json(friends)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const addFriendController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id
    const { username } = req.body
    await addFriend(user_id, username)
    res.status(200).json({ message: "Friend request sent" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const sendChatMessageController = async (
  req: Request,
  res: Response
) => {
  try {
    const sender_id = (req as any).user.user_id
    const { game_id, receiver_id, content } = req.body
    await sendChatMessage(sender_id, game_id, receiver_id, content)
    res.status(200).json({ message: "Message sent" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const updateProfileController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id
    const { avatar, bio } = req.body
    await updateProfile(user_id, avatar, bio)
    res.status(200).json({ message: "Profile updated" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
