# Battleship Game

A multiplayer battleship game with social features, tournaments, and achievements.

## Prerequisites

- Node.js and npm installed
- MySQL server (XAMPP recommended)
- Apache server (included with XAMPP)

## Local Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd battleship
```

2. Set up the client:
```bash
cd ./client
npm install
npm start
```

3. Set up the server:
```bash
cd ./server
npm install
npm start
```

4. Database Setup:
   - Start XAMPP and ensure MySQL and Apache services are running
   - Create a new database named `battleship`
   - Run the database migration script:
     ```sql
     source database/migrations/01_create_tables.sql
     ```

## Running the Application

1. The client will be available at `http://localhost:3000`
2. The server will be running at `http://localhost:3001`

## Features

- Multiplayer battleship gameplay
- User authentication and profiles
- Social features (friends, chat, posts)
- Tournament system
- Achievements and statistics
- News and FAQ sections

## Have Fun!

Enjoy playing Battleship with friends and competing in tournaments! 