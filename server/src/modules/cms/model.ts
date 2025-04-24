import { query } from "../../shared/config/database"

export interface News {
  id: number
  title: string
  content: string
  created_at: Date
}

export interface FAQ {
  id: number
  question: string
  answer: string
  created_at: Date
}

export const getAllNews = async (newsId?: number) => {
  let sql = `
    SELECT 
      id, 
      title, 
      content, 
      created_at
    FROM 
      news
  `

  if (newsId) {
    sql += " WHERE id = ?"
    return query(sql, [newsId])
  } else {
    sql += " ORDER BY created_at DESC"
    return query(sql)
  }
}

export const createNewsItem = async (title: string, content: string): Promise<number> => {
  const result = await query("INSERT INTO news (title, content, created_at) VALUES (?, ?, NOW())", [title, content])
  return result.insertId
}

export const getAllFaqs = async (faqId?: number) => {
  let sql = `
    SELECT 
      id, 
      question, 
      answer, 
      created_at
    FROM 
      faqs
  `

  if (faqId) {
    sql += " WHERE id = ?"
    return query(sql, [faqId])
  } else {
    sql += " ORDER BY created_at DESC"
    return query(sql)
  }
}

export const createFaqItem = async (question: string, answer: string): Promise<number> => {
  const result = await query("INSERT INTO faqs (question, answer, created_at) VALUES (?, ?, NOW())", [question, answer])
  return result.insertId
}
