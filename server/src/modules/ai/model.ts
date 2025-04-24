export interface DifficultyLevel {
  id: string
  name: string
  description: string
}

export const getAIDifficultyLevels = async (): Promise<DifficultyLevel[]> => {
  return [
    { id: "easy", name: "Easy", description: "Perfect for beginners" },
    { id: "medium", name: "Medium", description: "Balanced challenge" },
    { id: "hard", name: "Hard", description: "For experienced players" },
    { id: "expert", name: "Expert", description: "Strategic AI with advanced tactics" },
  ]
}
