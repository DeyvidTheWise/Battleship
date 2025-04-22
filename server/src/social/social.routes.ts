import { Router, Request, Response } from "express"
import {
  getFriendsController,
  addFriendController,
  sendChatMessageController,
  updateProfileController,
} from "./social.controller"
import { authenticate } from "../middleware/auth"

interface AddFriendRequestBody {
  username: string
}

interface SendChatMessageRequestBody {
  game_id?: string
  receiver_id?: string
  content: string
}

interface UpdateProfileRequestBody {
  avatar?: string
  bio?: string
}

const router = Router()

router.get("/friends", authenticate, async (req: Request, res: Response) => {
  await getFriendsController(req, res)
})

router.post(
  "/friends/add",
  authenticate,
  async (req: Request<{}, {}, AddFriendRequestBody>, res: Response) => {
    await addFriendController(req, res)
  }
)

router.post(
  "/chat/send",
  authenticate,
  async (req: Request<{}, {}, SendChatMessageRequestBody>, res: Response) => {
    await sendChatMessageController(req, res)
  }
)

router.post(
  "/profile/update",
  authenticate,
  async (req: Request<{}, {}, UpdateProfileRequestBody>, res: Response) => {
    await updateProfileController(req, res)
  }
)

export default router
