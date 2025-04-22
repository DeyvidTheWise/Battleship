import { makeAIMove } from "../src/ai/ai.service"
import sinon from "sinon"
import * as socketIO from "../src/utils/socket"
import { GameState } from "../src/types/index"

describe("AI Service", () => {
  let ioStub: sinon.SinonStub

  beforeEach(() => {
    ioStub = sinon.stub(socketIO, "getIO").returns({
      emit: sinon.stub(),
    } as any)
  })

  afterEach(() => {
    sinon.restore()
  })

  it("should make an AI move and hit a ship", async () => {
    const opponentState: GameState = {
      state_id: "state1",
      game_id: "game1",
      player_id: "player1",
      grid: {
        Carrier: { position: "A1", orientation: "horizontal" },
      },
      shots: [],
      remaining_ships: { Carrier: true },
      timer_state: { setup_timer: 0, shot_timer: 0 },
    }

    // Mock Math.random to always select 'A1'
    sinon.stub(Math, "random").returns(0)

    const move = await makeAIMove("game1", "easy", opponentState)
    expect(move.cell).toBe("A1")
    expect(move.result).toBe("hit")
    expect(
      ioStub().emit.calledWith("game-update", {
        game_id: "game1",
        shot: { cell: "A1", result: "hit" },
      })
    ).toBe(true)
  })

  it("should make an AI move and miss", async () => {
    const opponentState: GameState = {
      state_id: "state1",
      game_id: "game1",
      player_id: "player1",
      grid: {
        Carrier: { position: "A1", orientation: "horizontal" },
      },
      shots: [],
      remaining_ships: { Carrier: true },
      timer_state: { setup_timer: 0, shot_timer: 0 },
    }

    // Mock Math.random to select 'J10' (not a ship position)
    sinon.stub(Math, "random").returns(0.99)

    const move = await makeAIMove("game1", "easy", opponentState)
    expect(move.cell).toBe("J10")
    expect(move.result).toBe("miss")
    expect(
      ioStub().emit.calledWith("game-update", {
        game_id: "game1",
        shot: { cell: "J10", result: "miss" },
      })
    ).toBe(true)
  })
})
