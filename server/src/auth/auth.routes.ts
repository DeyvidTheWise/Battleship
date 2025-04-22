import { Router, Request, Response } from "express"
import {
  registerController,
  loginController,
  profileController,
} from "./auth.controller"
import { authenticate } from "../middleware/auth"

interface RegisterRequestBody {
  email: string
  username: string
  password: string
}

interface LoginRequestBody {
  email: string
  password: string
}

const router = Router()

router.post(
  "/register",
  async (req: Request<{}, {}, RegisterRequestBody>, res: Response) => {
    await registerController(req, res)
  }
)

router.post(
  "/login",
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    await loginController(req, res)
  }
)

router.get("/profile", authenticate, async (req: Request, res: Response) => {
  await profileController(req, res)
})

export default router
