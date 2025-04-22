export const SHIP_SIZES = {
  Carrier: 5,
  Battleship: 4,
  Cruiser: 3,
  Submarine: 3,
  Destroyer: 2,
} as const

export type ShipName = keyof typeof SHIP_SIZES

export function isValidShip(ship: string): ship is ShipName {
  return ship in SHIP_SIZES
}
