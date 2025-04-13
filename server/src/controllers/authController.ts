import { Request, Response } from "express"
import { body, validationResult } from "express-validator"
import { registerUser, loginUser } from "../services/userService"

export const register = [
  body("firstname").notEmpty().withMessage("First name is required"),
  body("lastname").notEmpty().withMessage("Last name is required"),
  body("email").isEmail().withMessage("Invalid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { firstname, lastname, email, password } = req.body

    try {
      const userId = await registerUser(firstname, lastname, email, password)
      res.status(201).json({ message: "User registered successfully", userId })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },
]

export const login = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").notEmpty().withMessage("Password is required"),
  async (req: Request, res: Response): Promise<void> => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() })
      return
    }

    const { email, password } = req.body

    try {
      const { token, user } = await loginUser(email, password)
      res.json({ token, user })
    } catch (error) {
      res.status(400).json({ error: (error as Error).message })
    }
  },
]
