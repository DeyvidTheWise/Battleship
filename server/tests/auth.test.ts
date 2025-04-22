import { register, login, getProfile } from "../src/auth/auth.service"
import sinon from "sinon"
import * as db from "../src/utils/db"
import bcrypt from "bcrypt"

describe("Auth Service", () => {
  let dbStub: sinon.SinonStub

  beforeEach(() => {
    dbStub = sinon.stub(db, "getConnection").resolves({
      execute: sinon.stub().resolves([]),
      end: sinon.stub().resolves(),
    } as any)
  })

  afterEach(() => {
    sinon.restore()
  })

  it("should register a new user", async () => {
    const result = await register("test@example.com", "testuser", "password")
    expect(result.user.email).toBe("test@example.com")
    expect(result.token).toBeDefined()
  })

  it("should login an existing user", async () => {
    try {
      const hashedPassword = await bcrypt.hash("password", 10) // Generate hash for "password"
      const mockUser = {
        user_id: "1",
        email: "test@example.com",
        username: "testuser",
        password: hashedPassword,
      }

      dbStub.resolves({
        execute: sinon.stub().resolves([[mockUser]]),
        end: sinon.stub().resolves(),
      })

      console.log("Calling login")
      const result = await login("test@example.com", "password")

      console.log("Result:", result)
      expect(result.user.email).toBe("test@example.com")
      expect(result.token).toBeDefined()
    } catch (error) {
      console.error("Error in login test:", error)
      throw error
    }
  })

  it("should get user profile", async () => {
    dbStub.resolves({
      execute: sinon
        .stub()
        .resolves([
          [{ user_id: "1", email: "test@example.com", username: "testuser" }],
        ]),
      end: sinon.stub().resolves(),
    } as any)

    const user = await getProfile("1")
    expect(user.user_id).toBe("1")
  })
})
