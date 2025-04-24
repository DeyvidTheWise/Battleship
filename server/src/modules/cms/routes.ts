import express from "express"
import { getNews, createNews, getFaqs, createFaq } from "./controller"
import { authenticateToken, authorizeAdmin } from "../../shared/middleware/auth"

const router = express.Router()

router.get("/news", getNews)

router.post("/news", authenticateToken, authorizeAdmin, createNews)

router.get("/faqs", getFaqs)

router.post("/faqs", authenticateToken, authorizeAdmin, createFaq)

export default router
