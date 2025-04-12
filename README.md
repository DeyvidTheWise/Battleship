# Battleship 🎮

Welcome to **Battleship**, an online multiplayer game where you can test your naval strategy skills! Built with React (TypeScript) for the frontend and Node.js (TypeScript) for the backend, this game supports both single-player (vs AI) and multiplayer modes. It features real-time gameplay using Socket.io and a MySQL database for storing user data and game stats.

## 🚀 Features

- **Multiplayer Mode**: Play against other players in real-time using Socket.io.
- **Single-Player Mode**: Challenge an AI opponent with random ship placement and shooting logic.
- **Leaderboard**: View the top players based on their XP.
- **User Registration and Login**: Placeholder for user authentication (backend implementation pending).
- **Custom Design**: A vibrant, nautical-themed UI with custom CSS, featuring an ocean gradient background and neon accents.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Socket.io-client
- **Backend**: Node.js, Express, TypeScript, Socket.io, MySQL
- **Database**: MySQL
- **Styling**: Custom CSS with a nautical theme

## 📦 Setup Instructions

Follow these steps to set up and run the Battleship project locally.

### Prerequisites

- **Node.js** (v16 or higher)
- **MySQL** (v8 or higher)
- **Git**

### 1. Clone the Repository

````bash
git clone https://github.com/DeyvidTheWise/Battleship.git
cd Battleship

### 2. Install Dependencies

## Client (Frontend)
```bash
   cd client
   npm install

## Server (Backend)
```bash
   cd server
   npm install

### 3. Set Up MySQL Database

## Create a MySQL database named battleship:
```sql

   CREATE DATABASE battleship;

(Optional) If you have a predefined SQL schema for tables (e.g., Users, Games), run it to set up the database. For now, the project uses an in-memory game state, but you can extend it to use MySQL for persistence.

### 4. Configure Environment Variables
Create a server/.env file with your MySQL credentials:
```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=battleship

### 5. Run the Server
```bash
   cd server
   npm start

The server will run on http://localhost:5000.

### 6. Run the Client
In a separate terminal:

```bash
   cd client
   npm start

The client will run on http://localhost:3000.

### 7. Access the App
Open your browser and go to http://localhost:3000. You can:

Play against the AI by navigating to /game?mode=single.
View the leaderboard at /leaderboard.
Register or log in (placeholder functionality).
````
