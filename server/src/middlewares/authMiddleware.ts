import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers.authorization?.split(" ")[1] // Expecting "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "No token provided" })
    return
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    req.user = { id: decoded.id }
    next()
  } catch (error) {
    res.status(401).json({ error: "Invalid token" })
    return
  }
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string }
    }
  }
}
