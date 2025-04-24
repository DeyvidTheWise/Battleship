
export type Difficulty = "easy" | "medium" | "hard"


type Board = number[][]


interface Shot {
  x: number
  y: number
  hit: boolean
}


export interface AIKnowledge {
  hitCells: { x: number; y: number }[]
  missCells: { x: number; y: number }[]
  potentialTargets: { x: number; y: number }[]
  lastHitDirection: "north" | "east" | "south" | "west" | null
  sunkShips: number
}


export const initializeAIKnowledge = (): AIKnowledge => {
  return {
    hitCells: [],
    missCells: [],
    potentialTargets: [],
    lastHitDirection: null,
    sunkShips: 0,
  }
}


export const updateAIKnowledge = (
  knowledge: AIKnowledge,
  shot: { x: number; y: number },
  isHit: boolean,
  isSunk: boolean,
): AIKnowledge => {
  const newKnowledge = { ...knowledge }

  if (isHit) {
    newKnowledge.hitCells = [...knowledge.hitCells, shot]

    
    if (isSunk) {
      newKnowledge.sunkShips += 1
      newKnowledge.lastHitDirection = null
      
      newKnowledge.potentialTargets = []
    } else {
      
      const directions = [
        { dx: 0, dy: -1, dir: "north" }, 
        { dx: 1, dy: 0, dir: "east" }, 
        { dx: 0, dy: 1, dir: "south" }, 
        { dx: -1, dy: 0, dir: "west" }, 
      ]

      const newTargets = directions
        .map((dir) => ({
          x: shot.x + dir.dx,
          y: shot.y + dir.dy,
          dir: dir.dir,
        }))
        .filter(
          (target) =>
            target.x >= 0 &&
            target.x < 10 &&
            target.y >= 0 &&
            target.y < 10 &&
            !knowledge.hitCells.some((cell) => cell.x === target.x && cell.y === target.y) &&
            !knowledge.missCells.some((cell) => cell.x === target.x && cell.y === target.y),
        )

      newKnowledge.potentialTargets = [...newKnowledge.potentialTargets, ...newTargets.map((t) => ({ x: t.x, y: t.y }))]
    }
  } else {
    newKnowledge.missCells = [...knowledge.missCells, shot]

    
    newKnowledge.potentialTargets = knowledge.potentialTargets.filter(
      (target) => !(target.x === shot.x && target.y === shot.y),
    )
  }

  return newKnowledge
}


export const getAIShot = (
  difficulty: Difficulty,
  knowledge: AIKnowledge,
  playerShips: any[],
  previousShots: { [key: string]: "hit" | "miss" },
): { x: number; y: number } => {
  
  const board = Array(10)
    .fill(0)
    .map(() => Array(10).fill(0))

  Object.entries(previousShots).forEach(([key, result]) => {
    const [x, y] = key.split(",").map(Number)
    board[y][x] = 1
  })

  
  if (knowledge.potentialTargets.length > 0) {
    const targetIndex = Math.floor(Math.random() * knowledge.potentialTargets.length)
    const target = knowledge.potentialTargets[targetIndex]
    return target
  }

  
  const strategy = getAIStrategy(difficulty)

  
  const shots: Shot[] = []
  Object.entries(previousShots).forEach(([key, result]) => {
    const [x, y] = key.split(",").map(Number)
    shots.push({ x, y, hit: result === "hit" })
  })

  
  if (difficulty === "easy") {
    return strategy.makeMove(board)
  }

  return strategy.makeMove(board, shots)
}


interface AIStrategy {
  makeMove: (board: Board, previousShots?: Shot[]) => { x: number; y: number }
}


class RandomStrategy implements AIStrategy {
  makeMove(board: Board): { x: number; y: number } {
    const size = board.length
    let x, y

    
    do {
      x = Math.floor(Math.random() * size)
      y = Math.floor(Math.random() * size)
    } while (board[y][x] !== 0)

    return { x, y }
  }
}


class HuntAndTargetStrategy implements AIStrategy {
  makeMove(board: Board, previousShots: Shot[] = []): { x: number; y: number } {
    const size = board.length
    const hits = previousShots.filter((shot) => shot.hit)

    
    if (hits.length > 0) {
      
      const lastHit = hits[hits.length - 1]

      
      const directions = [
        { dx: 0, dy: -1 }, 
        { dx: 1, dy: 0 }, 
        { dx: 0, dy: 1 }, 
        { dx: -1, dy: 0 }, 
      ]

      
      directions.sort(() => Math.random() - 0.5)

      for (const dir of directions) {
        const x = lastHit.x + dir.dx
        const y = lastHit.y + dir.dy

        
        if (x >= 0 && x < size && y >= 0 && y < size && board[y][x] === 0) {
          return { x, y }
        }
      }
    }

    
    return new RandomStrategy().makeMove(board)
  }
}


class ProbabilityStrategy implements AIStrategy {
  makeMove(board: Board, previousShots: Shot[] = []): { x: number; y: number } {
    const size = board.length

    
    const probabilityMap = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0))

    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        
        if (board[y][x] !== 0) {
          probabilityMap[y][x] = -1
          continue
        }

        
        
        let probability = 0

        
        for (let length = 2; length <= 5; length++) {
          if (x <= size - length) {
            let valid = true
            for (let i = 0; i < length; i++) {
              if (board[y][x + i] !== 0 && !(x + i === x && y === y)) {
                valid = false
                break
              }
            }
            if (valid) probability += length
          }
        }

        
        for (let length = 2; length <= 5; length++) {
          if (y <= size - length) {
            let valid = true
            for (let i = 0; i < length; i++) {
              if (board[y + i][x] !== 0 && !(x === x && y + i === y)) {
                valid = false
                break
              }
            }
            if (valid) probability += length
          }
        }

        probabilityMap[y][x] = probability
      }
    }

    
    let maxProb = -1
    let bestMoves: { x: number; y: number }[] = []

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        if (probabilityMap[y][x] > maxProb) {
          maxProb = probabilityMap[y][x]
          bestMoves = [{ x, y }]
        } else if (probabilityMap[y][x] === maxProb) {
          bestMoves.push({ x, y })
        }
      }
    }

    
    return bestMoves[Math.floor(Math.random() * bestMoves.length)]
  }
}


export function getAIStrategy(difficulty: Difficulty): AIStrategy {
  switch (difficulty) {
    case "easy":
      return new RandomStrategy()
    case "medium":
      return new HuntAndTargetStrategy()
    case "hard":
      return new ProbabilityStrategy()
    default:
      return new RandomStrategy()
  }
}
