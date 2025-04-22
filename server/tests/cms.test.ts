import {
  createAnnouncement,
  getAnalytics,
  getContent,
} from "../src/cms/cms.service"
import sinon from "sinon"
import * as db from "../src/utils/db"
import * as socketIO from "../src/utils/socket"
import { CMSContent, Analytic } from "../src/types/index"

describe("CMS Service", () => {
  let dbStub: sinon.SinonStub
  let ioStub: sinon.SinonStub

  beforeEach(() => {
    dbStub = sinon.stub(db, "getConnection").resolves({
      execute: sinon.stub().resolves([]),
      end: sinon.stub().resolves(),
    } as any)

    ioStub = sinon.stub(socketIO, "getIO").returns({
      emit: sinon.stub(),
    } as any)
  })

  afterEach(() => {
    sinon.restore()
  })

  it("should create an announcement and broadcast immediately", async () => {
    const expectedAnnouncement = {
      content_id: expect.any(String),
      type: "announcement",
      content: "New event!",
      schedule: undefined,
      created_at: expect.any(Date),
    }

    dbStub.resolves({
      execute: sinon.stub().resolves([]),
      end: sinon.stub().resolves(),
    })

    await createAnnouncement("admin1", "New event!")

    const emitCall = ioStub().emit.getCall(0)
    if (!emitCall) {
      console.error("ioStub().emit was not called")
      throw new Error("ioStub().emit was not called")
    }

    expect(emitCall.args[0]).toBe("announcement")
    expect(emitCall.args[1]).toEqual(
      expect.objectContaining(expectedAnnouncement)
    )
  })

  it("should create a scheduled announcement without broadcasting", async () => {
    const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24) // Tomorrow
    dbStub.resolves({
      execute: sinon.stub().resolves([]),
      end: sinon.stub().resolves(),
    } as any)

    await createAnnouncement("admin1", "Future event!", futureDate)
    expect(ioStub().emit.called).toBe(false)
  })

  it("should get analytics for a date range", async () => {
    const mockAnalytics: Analytic[] = [
      {
        analytic_id: "analytic1",
        metric_type: "daily_users",
        value: { count: 500 },
        date: new Date("2025-04-22"),
      },
    ]
    dbStub.resolves({
      execute: sinon.stub().resolves([mockAnalytics]),
      end: sinon.stub().resolves(),
    } as any)

    const analytics = await getAnalytics({
      start: new Date("2025-04-01"),
      end: new Date("2025-04-30"),
    })
    expect(analytics).toEqual(mockAnalytics)
  })

  it("should get all CMS content", async () => {
    const mockContent: CMSContent[] = [
      {
        content_id: "content1",
        type: "announcement",
        content: "Welcome!",
        created_at: new Date(),
      },
    ]
    dbStub.resolves({
      execute: sinon.stub().resolves([mockContent]),
      end: sinon.stub().resolves(),
    } as any)

    const content = await getContent()
    expect(content).toEqual(mockContent)
  })
})
