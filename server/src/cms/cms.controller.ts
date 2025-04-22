import { Request, Response } from "express"
import { createAnnouncement, getAnalytics, getContent } from "./cms.service"

export const createAnnouncementController = async (
  req: Request,
  res: Response
) => {
  try {
    const admin_id = (req as any).user.user_id
    const { content, schedule } = req.body
    await createAnnouncement(
      admin_id,
      content,
      schedule ? new Date(schedule) : undefined
    )
    res.status(201).json({ message: "Announcement created" })
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getAnalyticsController = async (req: Request, res: Response) => {
  try {
    const { start, end } = req.query
    const analytics = await getAnalytics({
      start: new Date(start as string),
      end: new Date(end as string),
    })
    res.status(200).json(analytics)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}

export const getContentController = async (req: Request, res: Response) => {
  try {
    const content = await getContent()
    res.status(200).json(content)
  } catch (error: any) {
    res.status(400).json({ error: error.message })
  }
}
