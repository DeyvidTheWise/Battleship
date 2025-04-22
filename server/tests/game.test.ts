import { createGame, placeShips, fireShot } from "../src/game/game.service"
import sinon from "sinon"
import * as db from "../src/utils/db"
import * as socketIO from "../src/utils/socket"
import { Game, GameState, Ship } from "../src/types/index"

describe("Game Service", () => {
  let dbStub: sinon.SinonStub
  let ioStub: sinon.SinonStub

  beforeEach(() => {
    // Clean up previous stubs
    sinon.restore()

    // Setup fresh stubs for each test
    dbStub = sinon.stub(db, "getConnection")
    ioStub = sinon.stub(socketIO, "getIO")

    // Set default behaviors to avoid undefined errors
    dbStub.resolves({
      execute: sinon.stub().resolves([]),
      end: sinon.stub().resolves(),
    })

    ioStub.returns({
      emit: sinon.stub(),
    })
  })

  afterEach(() => {
    sinon.restore()
    jest.restoreAllMocks()
  })

  it("should create a new game", async () => {
    try {
      // Use Jest fake timers to control setInterval
      jest.useFakeTimers()

      // Mock database connection
      dbStub.resolves({
        execute: sinon
          .stub()
          .onFirstCall()
          .resolves([]) // INSERT INTO Games
          .onSecondCall()
          .resolves([]) // INSERT INTO GameState (player1)
          .onThirdCall()
          .resolves([]), // INSERT INTO GameState (player2)
        end: sinon.stub().resolves(),
      })

      // Mock Socket.io
      const mockEmit = sinon.stub()
      ioStub.returns({
        emit: mockEmit,
      })

      console.log("Calling createGame")
      const game = await createGame("1v1", "player1", "player2")

      // Advance timers to trigger the first timer-update emit
      jest.advanceTimersByTime(1000)

      console.log("Game:", game)
      expect(game.game_id).toBeDefined()
      expect(game.mode).toBe("1v1")

      // Verify Socket.io emit calls
      expect(mockEmit.callCount).toBe(2) // 'game-update' and 'timer-update'
      expect(mockEmit.getCall(0).args).toEqual([
        "game-update",
        { game_id: game.game_id, status: "setup" },
      ])
      expect(mockEmit.getCall(1).args).toEqual([
        "timer-update",
        { game_id: game.game_id, setup_timer: 59 },
      ])

      // Clean up timers
      jest.useRealTimers()
    } catch (error) {
      console.error("Error in createGame test:", error)
      throw error
    }
  })

  it("should fire a shot", async () => {
    try {
      const mockGame = {
        game_id: "1",
        mode: "1v1",
        player1_id: "player1",
        player2_id: "player2",
        status: "active",
      }
      const mockStates = [
        {
          state_id: "1",
          game_id: "1",
          player_id: "player1",
          grid: "{}",
          shots: "[]",
          remaining_ships: JSON.stringify({ Carrier: true }),
          timer_state: "{}",
        },
        {
          state_id: "2",
          game_id: "1",
          player_id: "player2",
          grid: JSON.stringify({
            Carrier: { position: "A1", orientation: "horizontal" },
          }),
          shots: "[]",
          remaining_ships: JSON.stringify({ Carrier: true }),
          timer_state: "{}",
        },
      ]

      const mockExecute = sinon.stub()
      mockExecute
        .onFirstCall()
        .resolves([mockGame, []]) // SELECT * FROM Games WHERE game_id = ?
        .onSecondCall()
        .resolves([mockStates, []]) // SELECT * FROM GameState WHERE game_id = ?
        .onThirdCall()
        .resolves([[], []]) // UPDATE GameState SET shots = ?, remaining_ships = ? WHERE state_id = ?

      const mockEnd = sinon.stub().resolves()

      dbStub.resolves({
        execute: mockExecute,
        end: mockEnd,
      })

      const mockEmit = sinon.stub()
      ioStub.returns({
        emit: mockEmit,
      })

      console.log("Calling fireShot")
      const result = await fireShot("1", "player1", "A1")

      expect(mockExecute.callCount).toBe(3)
      expect(mockExecute.getCall(0).args).toEqual([
        "SELECT * FROM Games WHERE game_id = ?",
        ["1"],
      ])
      expect(mockExecute.getCall(1).args).toEqual([
        "SELECT * FROM GameState WHERE game_id = ?",
        ["1"],
      ])
      expect(mockExecute.getCall(2).args[0]).toBe(
        "UPDATE GameState SET shots = ?, remaining_ships = ? WHERE state_id = ?"
      )
      expect(mockEnd.calledOnce).toBe(true)

      console.log("Result:", result)
      expect(result.result).toBe("hit")
      expect(mockEmit.callCount).toBeGreaterThan(0)
    } catch (error) {
      console.error("Error in fireShot test:", error)
      throw error
    }
  })

  it("should fire a shot", async () => {
    try {
      const mockGame = {
        game_id: "1",
        mode: "1v1",
        player1_id: "player1",
        player2_id: "player2",
        status: "active",
      }
      const mockStates = [
        {
          state_id: "1",
          game_id: "1",
          player_id: "player1",
          grid: "{}",
          shots: "[]",
          remaining_ships: JSON.stringify({ Carrier: true }),
          timer_state: "{}",
        },
        {
          state_id: "2",
          game_id: "1",
          player_id: "player2",
          grid: JSON.stringify({
            Carrier: { position: "A1", orientation: "horizontal" },
          }),
          shots: "[]",
          remaining_ships: JSON.stringify({ Carrier: true }),
          timer_state: "{}",
        },
      ]

      // Configure this test's stub without resetting (we've already reset in beforeEach)
      dbStub.resolves({
        execute: sinon
          .stub()
          .onFirstCall()
          .resolves([[mockGame]])
          .onSecondCall()
          .resolves([mockStates]) // Ensure this matches the expected structure
          .onThirdCall()
          .resolves([]),
        end: sinon.stub().resolves(),
      })

      // Make sure the ioStub returns something with an emit method
      const mockEmit = sinon.stub()
      ioStub.returns({
        emit: mockEmit,
      })

      console.log("Calling fireShot")
      const result = await fireShot("1", "player1", "A1")

      console.log("Result:", result)
      expect(result.result).toBe("hit")
      // Verify that emit was called as expected
      expect(mockEmit.callCount).toBeGreaterThan(0)
    } catch (error) {
      console.error("Error in fireShot test:", error)
      throw error
    }
  })
})
