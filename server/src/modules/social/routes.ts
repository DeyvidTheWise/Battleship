import express from "express"
import {
  getPosts,
  createPost,
  getFriends,
  sendFriendRequest,
  getFriendRequestsList,
  acceptRequest,
  rejectRequest,
} from "./controller"
import { authenticateToken } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/posts", getPosts)

router.post("/posts", authenticateToken, createPost)

router.get("/friends", authenticateToken, getFriends)

router.post("/friends/request", authenticateToken, sendFriendRequest)

router.get("/friends/requests", authenticateToken, getFriendRequestsList)

router.post(
  "/friends/requests/:requestId/accept",
  authenticateToken,
  acceptRequest
)

router.post(
  "/friends/requests/:requestId/reject",
  authenticateToken,
  rejectRequest
)

export default router
