CREATE TABLE Users (
  user_id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar VARCHAR(255),
  bio TEXT,
  elo INT DEFAULT 1000,
  wins INT DEFAULT 0,
  losses INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Games (
  game_id VARCHAR(36) PRIMARY KEY,
  mode ENUM('1v1', 'vs_ai', 'anonymous_ai', 'practice') NOT NULL,
  player1_id VARCHAR(36) NOT NULL,
  player2_id VARCHAR(36),
  status ENUM('setup', 'active', 'finished') NOT NULL,
  winner_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player1_id) REFERENCES Users(user_id),
  FOREIGN KEY (player2_id) REFERENCES Users(user_id),
  FOREIGN KEY (winner_id) REFERENCES Users(user_id)
);

CREATE TABLE GameState (
  state_id VARCHAR(36) PRIMARY KEY,
  game_id VARCHAR(36) NOT NULL,
  player_id VARCHAR(36) NOT NULL,
  grid JSON NOT NULL,
  shots JSON NOT NULL,
  remaining_ships JSON NOT NULL,
  timer_state JSON NOT NULL,
  FOREIGN KEY (game_id) REFERENCES Games(game_id),
  FOREIGN KEY (player_id) REFERENCES Users(user_id)
);

CREATE TABLE Friends (
  friendship_id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  friend_id VARCHAR(36) NOT NULL,
  status ENUM('pending', 'accepted', 'blocked') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (friend_id) REFERENCES Users(user_id)
);

CREATE TABLE ChatMessages (
  message_id VARCHAR(36) PRIMARY KEY,
  sender_id VARCHAR(36) NOT NULL,
  game_id VARCHAR(36),
  receiver_id VARCHAR(36),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES Users(user_id),
  FOREIGN KEY (game_id) REFERENCES Games(game_id),
  FOREIGN KEY (receiver_id) REFERENCES Users(user_id)
);

CREATE TABLE CMSContent (
  content_id VARCHAR(36) PRIMARY KEY,
  type ENUM('announcement', 'tutorial', 'faq') NOT NULL,
  content TEXT NOT NULL,
  media_url VARCHAR(255),
  schedule TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Analytics (
  analytic_id VARCHAR(36) PRIMARY KEY,
  metric_type ENUM('daily_users', 'game_modes', 'session_length') NOT NULL,
  value JSON NOT NULL,
  date DATE NOT NULL
);