import { Request, Response } from "express"
import { register, login, getProfile } from "./auth.service"

export const registerController = async (req: Request, res: Response) => {
  try {
    const { email, username, password } = req.body
    const { token, user } = await register(email, username, password)
    res
      .status(201)
      .json({ token, user_id: user.user_id, username: user.username })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const loginController = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const { token, user } = await login(email, password)
    res
      .status(200)
      .json({ token, user_id: user.user_id, username: user.username })
  } catch (error: any) {
    res.status(401).json({ error: error.message })
  }
}

export const profileController = async (req: Request, res: Response) => {
  try {
    const user_id = (req as any).user.user_id
    const user = await getProfile(user_id)
    res.status(200).json(user)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
