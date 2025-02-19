# 🛳️ Battleship Online

## 🏆 Overview
**Battleship Online** is a web-based multiplayer game inspired by the classic board game *Battleship*. The game allows players to challenge each other in real-time, strategize their attacks, and sink their opponent's fleet.

## 🌟 Features
- **⚔️ Multiplayer Gameplay**: Compete against friends or other players online.
- **💬 Real-time Interaction**: Seamless communication using WebSockets.
- **🎨 User-friendly Interface**: A modern UI built with HTML, CSS, and JavaScript.
- **🔒 Secure Backend**: Efficient game state management using Node.js and MySQL.
- **🌐 Hosted Online**: The game will be available at [**https://battleshipgame.online/**](https://battleshipgame.online/).

## 🛠️ Tech Stack
### 🎨 Frontend:
- **HTML, CSS, JavaScript** for core web development.
- **React.js** (optional) for enhanced UI components.
- **Socket.io** for real-time communication.

### ⚙️ Backend:
- **Node.js** with **TypeScript** for scalable server-side logic.
- **Socket.io** for handling WebSockets.
- **MySQL** for database management.

## 🚀 Installation
### 📌 Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [MySQL](https://www.mysql.com/)

### 🔗 Clone the Repository
```sh
git clone https://github.com/DeyvidTheWise/Battleship.git
cd Battleship
```

### 🖥️ Backend Setup
1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add the following environment variables:
   ```ini
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=battleship
   ```
4. Start the backend server:
   ```sh
   npm run dev
   ```

### 🎭 Frontend Setup
1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm start
   ```

## 🎮 How to Play
1. Open the application in your web browser.
2. Create a game session or join an existing one.
3. Place your ships strategically on the board.
4. Take turns firing at your opponent’s grid.
5. Sink all enemy ships to win!

## 👥 Contributors
- **Simon-Daniel Manev**
- **Martin Hristov**
- **Deyvid Popov**

## 📜 License
This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

