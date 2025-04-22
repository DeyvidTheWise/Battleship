import React from "react"
import { Text } from "atoms"
import styles from "./FAQsTutorialsTemplate.module.css"

interface FAQsTutorialsTemplateProps {
  content: { title: string; description: string; media?: string }[]
}

const FAQsTutorialsTemplate: React.FC<FAQsTutorialsTemplateProps> = ({
  content,
}) => {
  return (
    <div className={styles.faqsTutorialsTemplate}>
      <Text content="FAQs & Tutorials" variant="title" />
      <div className={styles.contentList}>
        {content.map((item, idx) => (
          <div key={idx} className={styles.contentItem}>
            <Text content={item.title} variant="body" />
            <Text content={item.description} variant="secondary" />
            {item.media && (
              <img src={item.media} alt={item.title} className={styles.media} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default FAQsTutorialsTemplate
