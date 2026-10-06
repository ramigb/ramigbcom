import type { Vec2 } from './space'

export type Polygon = readonly Vec2[]

export function pointInPolygon(x: number, y: number, poly: Polygon): boolean {
  let inside = false
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i] ?? [0, 0]
    const [xj, yj] = poly[j] ?? [0, 0]
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

export function polygonBounds(poly: Polygon): [number, number, number, number] {
  const xs = poly.map((p) => p[0])
  const ys = poly.map((p) => p[1])
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]
}
