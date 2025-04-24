import type React from "react"
import { Link } from "react-router-dom"
import "./HomePage.css"

const HomePage: React.FC = () => {
  return (
    <div className="home-container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Battleship</h1>
          <p>The classic naval combat game reimagined for the digital age</p>
          <div className="hero-buttons">
            <Link to="/game/ai-anonymous" className="btn btn-primary">
              Play Now
            </Link>
            <Link to="/auth/register" className="btn btn-secondary">
              Sign Up
            </Link>
          </div>
        </div>
      </section>

      <section className="features">
        <h2>Game Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Play Against AI</h3>
            <p>Challenge our advanced AI opponent with multiple difficulty levels</p>
          </div>
          <div className="feature-card">
            <h3>Multiplayer Battles</h3>
            <p>Compete against friends or random opponents in real-time</p>
          </div>
          <div className="feature-card">
            <h3>Tournaments</h3>
            <p>Join tournaments and climb the ranks to become the ultimate admiral</p>
          </div>
          <div className="feature-card">
            <h3>Track Your Progress</h3>
            <p>View detailed statistics and earn achievements as you play</p>
          </div>
        </div>
      </section>

      <section className="game-modes">
        <h2>Game Modes</h2>
        <div className="mode-cards">
          <div className="mode-card">
            <h3>Quick Play</h3>
            <p>Jump straight into a game against our AI without an account</p>
            <Link to="/game/ai-anonymous" className="btn btn-small">
              Play Now
            </Link>
          </div>
          <div className="mode-card">
            <h3>Ranked Matches</h3>
            <p>Compete in ranked matches to climb the global leaderboard</p>
            <Link to="/auth/login" className="btn btn-small">
              Sign In to Play
            </Link>
          </div>
          <div className="mode-card">
            <h3>Practice Mode</h3>
            <p>Hone your skills in a relaxed environment with no stakes</p>
            <Link to="/game/practice" className="btn btn-small">
              Practice
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
