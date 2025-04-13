import React, { useState } from "react"
import Button from "../atoms/Button"
import { Text } from "../atoms/Text"

interface ShipSelectorProps {
  ships: { name: string; size: number }[]
  onPlaceShip: (
    shipName: string,
    coordinates: { x: number; y: number }[],
    isHorizontal: boolean
  ) => void
}

export const ShipSelector: React.FC<ShipSelectorProps> = ({
  ships,
  onPlaceShip,
}) => {
  const [selectedShip, setSelectedShip] = useState<string | null>(null)
  const [isHorizontal, setIsHorizontal] = useState(true)
  const [startX, setStartX] = useState<number | null>(null)
  const [startY, setStartY] = useState<number | null>(null)

  const handlePlaceShip = () => {
    if (!selectedShip || startX === null || startY === null) return

    const ship = ships.find((s) => s.name === selectedShip)
    if (!ship) return

    const coordinates: { x: number; y: number }[] = []
    for (let i = 0; i < ship.size; i++) {
      const x = isHorizontal ? startX + i : startX
      const y = isHorizontal ? startY : startY + i
      coordinates.push({ x, y })
    }

    onPlaceShip(selectedShip, coordinates, isHorizontal)
    setSelectedShip(null)
    setStartX(null)
    setStartY(null)
  }

  return (
    <div className="glass-container">
      <Text variant="h2" className="mb-4">
        Place Your Ships
      </Text>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1rem",
        }}
      >
        {ships.map((ship) => (
          <Button
            key={ship.name}
            variant={selectedShip === ship.name ? "primary" : "secondary"}
            onClick={() => setSelectedShip(ship.name)}
          >
            {ship.name} ({ship.size})
          </Button>
        ))}
      </div>
      <Button
        onClick={() => setIsHorizontal(!isHorizontal)}
        variant="secondary"
        style={{ marginBottom: "1rem" }}
      >
        {isHorizontal ? "Horizontal" : "Vertical"}
      </Button>
      {selectedShip && (
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Text>Start X:</Text>
            <input
              type="number"
              min="0"
              max="9"
              value={startX ?? ""}
              onChange={(e) => setStartX(Number(e.target.value))}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <Text>Start Y:</Text>
            <input
              type="number"
              min="0"
              max="9"
              value={startY ?? ""}
              onChange={(e) => setStartY(Number(e.target.value))}
            />
          </div>
          <Button onClick={handlePlaceShip}>Place Ship</Button>
        </div>
      )}
    </div>
  )
}
