// client/src/components/pages/Home.tsx
import React from "react"
import { useNavigate } from "react-router-dom"
import { Element } from "react-scroll"
import { Text, Button } from "../atoms"
import { PageLayout } from "../organisms"
import { useAuth } from "../../context/AuthContext"

const Home: React.FC = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <PageLayout isHomePage>
      <Element name="home">
        <div style={{ textAlign: "center", padding: "4rem 1.5rem" }}>
          <Text variant="h1" style={{ marginBottom: "1.5rem", color: "#fff" }}>
            Welcome to Battleship
          </Text>
          <Text
            style={{ marginBottom: "2rem", fontSize: "1.2rem", color: "#ddd" }}
          >
            Challenge your friends or test your skills against AI in this
            classic naval strategy game!
          </Text>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "1rem" }}
          >
            {user ? (
              <>
                <Button onClick={() => navigate("/lobby")} variant="primary">
                  Play Now
                </Button>
                <Button
                  onClick={() => navigate(`/profile/${user.id}`)}
                  variant="secondary"
                >
                  My Profile
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/game?mode=single")}
                  variant="primary"
                >
                  Play vs AI
                </Button>
                <Button onClick={() => navigate("/lobby")} variant="secondary">
                  Play 1v1
                </Button>
              </>
            )}
          </div>
        </div>
      </Element>
      <Element name="history">
        <div
          style={{
            textAlign: "center",
            padding: "4rem 1.5rem",
            background: "rgba(255, 255, 255, 0.05)",
          }}
        >
          <Text variant="h2" style={{ marginBottom: "1.5rem", color: "#fff" }}>
            History of Battleship
          </Text>
          <Text style={{ maxWidth: "800px", margin: "0 auto", color: "#ddd" }}>
            Battleship originated as a paper-and-pencil game in the early 20th
            century, gaining popularity during World War I. It was later adapted
            into a board game by Milton Bradley in 1967, becoming a household
            name. The game simulates naval combat, where players strategically
            place their fleet and attempt to sink their opponent's ships by
            guessing their coordinates. Today, Battleship remains a beloved
            classic, enjoyed in both physical and digital formats worldwide.
          </Text>
        </div>
      </Element>
    </PageLayout>
  )
}

export default Home
