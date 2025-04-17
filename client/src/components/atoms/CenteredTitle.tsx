import React from "react"
import Text from "./Text"

interface CenteredTitleProps {
  children: React.ReactNode
}

const CenteredTitle: React.FC<CenteredTitleProps> = ({ children }) => (
  <Text
    variant="h1"
    style={{
      textAlign: "center",
      marginBottom: "1.5rem",
      color: "#fff",
    }}
  >
    {children}
  </Text>
)

export default CenteredTitle
