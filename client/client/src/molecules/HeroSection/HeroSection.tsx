import React from "react"
import { HeroSectionProps } from "@shared-types"
import { Text, Button } from "atoms"
import styles from "./HeroSection.module.css"

const HeroSection: React.FC<HeroSectionProps> = ({ onPlayClick }) => {
  return (
    <div className={styles.heroSection}>
      <Text content="Online Battleship" variant="title" />
      <Button text="Play Now" onClick={onPlayClick} />
    </div>
  )
}

export default HeroSection
