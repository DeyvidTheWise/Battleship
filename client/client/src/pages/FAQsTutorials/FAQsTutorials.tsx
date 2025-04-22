import React from "react"
import { FAQsTutorialsTemplate } from "templates"
import styles from "./FAQsTutorials.module.css"

const FAQsTutorials: React.FC = () => {
  const content = [
    {
      title: "How to Play",
      description: "Learn the basics of Battleship.",
      media: "https://via.placeholder.com/200",
    },
    {
      title: "FAQ: How do I reset my password?",
      description: "Follow these steps to reset your password.",
    },
  ]

  return (
    <div className={styles.faqsTutorials}>
      <FAQsTutorialsTemplate content={content} />
    </div>
  )
}

export default FAQsTutorials
