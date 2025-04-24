const bcrypt = require("bcryptjs")
const { query } = require("../../server/shared/config/database")

const seedDatabase = async () => {
  try {
    const salt = await bcrypt.genSalt(10)
    const adminPassword = await bcrypt.hash("admin123", salt)

    await query(
      "INSERT INTO users (username, email, password, role, created_at) VALUES (?, ?, ?, ?, ?)",
      ["admin", "admin@battleship.com", adminPassword, "admin", new Date()]
    )

    const achievements = [
      {
        name: "First Victory",
        description: "Win your first game",
        icon: "trophy",
        requirement: "games_won >= 1",
      },
      {
        name: "Sharpshooter",
        description: "Win a game with 90% accuracy",
        icon: "target",
        requirement: "accuracy >= 90",
      },
      {
        name: "Fleet Admiral",
        description: "Reach Elo 1500",
        icon: "medal",
        requirement: "elo >= 1500",
      },
      {
        name: "Unstoppable",
        description: "Win 5 games in a row",
        icon: "flame",
        requirement: "current_win_streak >= 5",
      },
      {
        name: "Master Tactician",
        description: "Reach Elo 2000",
        icon: "award",
        requirement: "elo >= 2000",
      },
      {
        name: "Perfect Game",
        description: "Win without missing a shot",
        icon: "crosshair",
        requirement: "shots_fired = shots_hit AND shots_fired > 0",
      },
    ]

    for (const achievement of achievements) {
      await query(
        "INSERT INTO achievements (name, description, icon, requirement, created_at) VALUES (?, ?, ?, ?, ?)",
        [
          achievement.name,
          achievement.description,
          achievement.icon,
          achievement.requirement,
          new Date(),
        ]
      )
    }

    const faqs = [
      {
        question: "How do I play Battleship?",
        answer:
          "Battleship is a strategy game where you place ships on a grid and try to sink your opponent's ships by guessing their locations. Each player takes turns firing shots at the opponent's grid.",
        category: "Gameplay",
        order_number: 1,
      },
      {
        question: "How do I place my ships?",
        answer:
          "During the setup phase, you can place your ships on the grid by dragging them or clicking on the grid. You can also rotate ships by clicking the rotate button or pressing the R key.",
        category: "Gameplay",
        order_number: 2,
      },
      {
        question: "What are the different game modes?",
        answer:
          "Battleship Online offers several game modes: 1v1 Multiplayer (play against other players), Play vs AI (play against AI with adjustable difficulty), Quick Play (play without an account), and Practice Mode (experiment with strategies).",
        category: "Gameplay",
        order_number: 3,
      },
      {
        question: "How do I create an account?",
        answer:
          "Click on the Register button in the top right corner of the homepage. Fill in your username, email, and password, then click Register.",
        category: "Account",
        order_number: 1,
      },
      {
        question: "How do I reset my password?",
        answer:
          'Click on the Login button, then click on "Forgot Password". Enter your email address and follow the instructions sent to your email.',
        category: "Account",
        order_number: 2,
      },
    ]

    for (const faq of faqs) {
      await query(
        "INSERT INTO faqs (question, answer, category, order_number, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
        [
          faq.question,
          faq.answer,
          faq.category,
          faq.order_number,
          new Date(),
          new Date(),
        ]
      )
    }

    await query(
      "INSERT INTO news_articles (title, content, author_id, published, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      [
        "Welcome to Battleship Online!",
        "Our new modern battleship game is now in beta. Try out all game modes and let us know what you think!",
        1,
        true,
        new Date(),
        new Date(),
      ]
    )

    console.log("Database seeded successfully")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}

module.exports = {
  seedDatabase,
}
