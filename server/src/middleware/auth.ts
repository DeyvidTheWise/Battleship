import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = "your_jwt_secret"

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1]
  if (!token) return res.status(401).json({ error: "No token provided" })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    ;(req as any).user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
  }
}

export const adminOnly = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user_id = (req as any).user.user_id
  if (user_id !== "admin-uuid-1234") {
    return res.status(403).json({ error: "Admin access required" })
  }
  next()
}
