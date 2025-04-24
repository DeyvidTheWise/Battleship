import type { Request, Response } from "express"
import { getAllNews, createNewsItem, getAllFaqs, createFaqItem } from "./model"

export const getNews = async (req: Request, res: Response) => {
  try {
    const news = await getAllNews()
    res.json({ news })
  } catch (error) {
    console.error("Get news error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createNews = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body
    const newsId = await createNewsItem(title, content)
    const news = await getAllNews(newsId)
    res.status(201).json({ news: news[0] })
  } catch (error) {
    console.error("Create news error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getFaqs = async (req: Request, res: Response) => {
  try {
    const faqs = await getAllFaqs()
    res.json({ faqs })
  } catch (error) {
    console.error("Get FAQs error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const createFaq = async (req: Request, res: Response) => {
  try {
    const { question, answer } = req.body
    const faqId = await createFaqItem(question, answer)
    const faqs = await getAllFaqs(faqId)
    res.status(201).json({ faq: faqs[0] })
  } catch (error) {
    console.error("Create FAQ error:", error)
    res.status(500).json({ message: "Server error" })
  }
}
