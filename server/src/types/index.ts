export interface User {
  user_id: string
  email: string
  username: string
  password: string
  avatar?: string
  bio?: string
  elo: number
  wins: number
  losses: number
  created_at: Date
}

export interface Game {
  game_id: string
  mode: "1v1" | "vs_ai" | "anonymous_ai" | "practice"
  player1_id: string
  player2_id?: string
  status: "setup" | "active" | "finished"
  winner_id?: string
  created_at: Date
}

export interface GameState {
  state_id: string
  game_id: string
  player_id: string
  grid: {
    [ship: string]: { position: string; orientation: "horizontal" | "vertical" }
  }
  shots: { cell: string; result: "hit" | "miss" }[]
  remaining_ships: { [ship: string]: boolean }
  timer_state: { setup_timer: number; shot_timer: number }
}

export interface Friend {
  friendship_id: string
  user_id: string
  friend_id: string
  status: "pending" | "accepted" | "blocked"
  created_at: Date
}

export interface ChatMessage {
  message_id: string
  sender_id: string
  game_id?: string
  receiver_id?: string
  content: string
  created_at: Date
}

export interface CMSContent {
  content_id: string
  type: "announcement" | "tutorial" | "faq"
  content: string
  media_url?: string
  schedule?: Date
  created_at: Date
}

export interface Analytic {
  analytic_id: string
  metric_type: "daily_users" | "game_modes" | "session_length"
  value: { [key: string]: number }
  date: Date
}

export interface Ship {
  name: string
  length: number
  position: string
  orientation: "horizontal" | "vertical"
}
