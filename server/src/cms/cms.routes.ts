import { Request, Response } from "express"
import { createAnnouncement, getAnalytics, getContent } from "./cms.service"

export const createAnnouncementController = async (
  req: Request,
  res: Response
) => {
  try {
    const admin_id = req.user?.user_id
    if (!admin_id) {
      throw new Error("Unauthorized")
    }
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

export const getAnalyticsController = async (
  req: Request<
    {},
    {},
    {},
    { start?: string | string[]; end?: string | string[] }
  >,
  res: Response
) => {
  try {
    const { start, end } = req.query

    if (!start || !end) {
      throw new Error("Missing required query parameters: start and end")
    }

    const startDate = Array.isArray(start) ? start[0] : start
    const endDate = Array.isArray(end) ? end[0] : end

    if (
      !startDate ||
      !endDate ||
      isNaN(Date.parse(startDate)) ||
      isNaN(Date.parse(endDate))
    ) {
      throw new Error("Invalid date format for start or end")
    }

    const analytics = await getAnalytics({
      start: new Date(startDate),
      end: new Date(endDate),
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
