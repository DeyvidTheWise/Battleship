import {
  getFriends,
  addFriend,
  sendChatMessage,
  updateProfile,
} from "../src/social/social.service"
import sinon from "sinon"
import * as db from "../src/utils/db"
import * as socketIO from "../src/utils/socket"
import { Friend, ChatMessage } from "../src/types/index"

describe("Social Service", () => {
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

  it("should get friends list", async () => {
    const mockFriends: Friend[] = [
      {
        friendship_id: "friendship-1",
        user_id: "user1",
        friend_id: "user2",
        status: "accepted",
        created_at: new Date(),
      },
    ]
    dbStub.resolves({
      execute: sinon.stub().resolves([mockFriends]),
      end: sinon.stub().resolves(),
    } as any)

    const friends = await getFriends("user1")
    expect(friends).toEqual(mockFriends)
  })

  it("should add a friend", async () => {
    dbStub.resolves({
      execute: sinon
        .stub()
        .onFirstCall()
        .resolves([[{ user_id: "user2" }]])
        .onSecondCall()
        .resolves([]),
      end: sinon.stub().resolves(),
    } as any)

    await addFriend("user1", "user2")
    expect(
      ioStub().emit.calledWith("friend-status", {
        user_id: "user2",
        status: "pending",
      })
    ).toBe(true)
  })

  it("should fail to add a non-existent friend", async () => {
    dbStub.resolves({
      execute: sinon.stub().resolves([[]]),
      end: sinon.stub().resolves(),
    } as any)

    await expect(addFriend("user1", "nonexistent")).rejects.toThrow(
      "User not found"
    )
  })

  it("should send a chat message", async () => {
    const expectedMessage = {
      message_id: expect.any(String),
      sender_id: "user1",
      game_id: "game1",
      receiver_id: undefined,
      content: "Hello!",
      created_at: expect.any(Date),
    }

    dbStub.resolves({
      execute: sinon.stub().resolves([]),
      end: sinon.stub().resolves(),
    })

    await sendChatMessage("user1", "game1", undefined, "Hello!")

    const emitCall = ioStub().emit.getCall(0)
    if (!emitCall) {
      console.error("ioStub().emit was not called")
      throw new Error("ioStub().emit was not called")
    }

    expect(emitCall.args[0]).toBe("chat-message")
    expect(emitCall.args[1]).toEqual(expect.objectContaining(expectedMessage))
  })

  it("should update user profile", async () => {
    const mockExecute = sinon.stub().resolves([])
    const mockEnd = sinon.stub().resolves()

    dbStub.resolves({
      execute: mockExecute,
      end: mockEnd,
    })

    await updateProfile("user1", "new-avatar.png", "New bio")

    expect(mockExecute.calledOnce).toBe(true)
    expect(
      mockExecute.calledWith(
        "UPDATE Users SET avatar = ?, bio = ? WHERE user_id = ?",
        ["new-avatar.png", "New bio", "user1"]
      )
    ).toBe(true)
    expect(mockEnd.calledOnce).toBe(true)
  })
})
